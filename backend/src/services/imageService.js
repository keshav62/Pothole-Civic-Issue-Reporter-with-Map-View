import { Readable } from 'stream';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import Issue from '../models/Issue.js';
import IssueHistory, { HISTORY_ACTIONS } from '../models/IssueHistory.js';

// ─── Cloudinary folder map ────────────────────────────────────────────────────
// Keeps uploads organised by purpose. Never stored in MongoDB — just the URL.

const FOLDERS = {
  issue:  'civicconnect/issues',
  before: 'civicconnect/before',
  after:  'civicconnect/after',
};

// ─── Core upload helper ───────────────────────────────────────────────────────

/**
 * uploadBufferToCloudinary(buffer, folder, filename)
 *
 * Streams a multer in-memory buffer to Cloudinary.
 * Returns the secure HTTPS URL of the uploaded image.
 * The Cloudinary API secret never leaves the server.
 *
 * @param {Buffer} buffer   - Raw file bytes from multer memoryStorage
 * @param {string} folder   - Destination Cloudinary folder
 * @param {string} filename - Used as the public_id prefix for predictable naming
 */
export const uploadBufferToCloudinary = (buffer, folder = FOLDERS.issue, filename = 'issue') => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      const err = new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing on the backend.');
      err.statusCode = 500;
      return reject(err);
    }

    // Ensure Cloudinary is configured with current process.env
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure:     true,
    });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id:        `${filename}_${Date.now()}`,
        resource_type:    'image',
        allowed_formats:  ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { quality: 'auto:good' },   // auto-compress without visible loss
          { fetch_format: 'auto' },   // serve WebP/AVIF to supporting browsers
        ],
      },
      (error, result) => {
        if (error) {
          const err = new Error(`Cloudinary upload failed: ${error.message}`);
          err.statusCode = 500;
          return reject(err);
        }
        resolve(result.secure_url);   // always HTTPS — api_secret never exposed
      }
    );

    // Convert the buffer into a readable stream and pipe to Cloudinary
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// ─── Exported service functions ───────────────────────────────────────────────

/**
 * uploadIssueImages
 *
 * Uploads one or more report images for a new or existing issue.
 * Appends the returned URLs to issue.images and saves.
 *
 * Called from:  POST /api/issues  and  PATCH /api/issues/:id/images
 * Field name:   'images'
 *
 * @param {string}   issueId  - MongoDB ObjectId
 * @param {Object[]} files    - Array of multer file objects (req.files)
 * @param {Object}   user     - The authenticated req.user
 */
export const uploadIssueImages = async (issueId, files, user) => {
  if (!files || files.length === 0) {
    const err = new Error('No image files provided');
    err.statusCode = 400;
    throw err;
  }

  const issue = await Issue.findById(issueId);
  if (!issue) {
    const err = new Error('Issue not found');
    err.statusCode = 404;
    throw err;
  }

  // Upload all files in parallel — fail fast if any upload fails
  const uploadedUrls = await Promise.all(
    files.map((file) =>
      uploadBufferToCloudinary(file.buffer, FOLDERS.issue, `issue_${issueId}`)
    )
  );

  // Append URLs to the existing images array and persist
  issue.images.push(...uploadedUrls);
  await issue.save();

  // Record history
  await IssueHistory.create({
    issue:       issueId,
    action:      HISTORY_ACTIONS.PROOF_UPLOADED,
    oldStatus:   issue.status,
    newStatus:   issue.status,
    performedBy: user._id,
    note:        `${uploadedUrls.length} report image(s) uploaded`,
  });

  return { uploadedUrls, issue };
};

/**
 * uploadBeforeImages
 *
 * Uploads field worker's before-repair evidence.
 * Appends to issue.beforeImages.
 *
 * Called from:  PATCH /api/workers/tasks/:id/before-images
 * Field name:   'beforeImages'
 *
 * Only the assigned FIELD_WORKER may upload before images.
 *
 * @param {string}   issueId  - MongoDB ObjectId
 * @param {Object[]} files    - Array of multer file objects
 * @param {Object}   user     - req.user (FIELD_WORKER)
 */
export const uploadBeforeImages = async (issueId, files, user) => {
  if (!files || files.length === 0) {
    const err = new Error('No image files provided');
    err.statusCode = 400;
    throw err;
  }

  const issue = await Issue.findById(issueId);
  if (!issue) {
    const err = new Error('Issue not found');
    err.statusCode = 404;
    throw err;
  }

  // Ownership: only the assigned worker may upload before images
  if (!issue.assignedWorker || issue.assignedWorker.toString() !== user._id.toString()) {
    const err = new Error('Forbidden: This task is not assigned to you');
    err.statusCode = 403;
    throw err;
  }

  const uploadedUrls = await Promise.all(
    files.map((file) =>
      uploadBufferToCloudinary(file.buffer, FOLDERS.before, `before_${issueId}`)
    )
  );

  issue.beforeImages.push(...uploadedUrls);
  await issue.save();

  await IssueHistory.create({
    issue:       issueId,
    action:      HISTORY_ACTIONS.PROOF_UPLOADED,
    oldStatus:   issue.status,
    newStatus:   issue.status,
    performedBy: user._id,
    note:        `${uploadedUrls.length} before-repair image(s) uploaded`,
  });

  return { uploadedUrls, issue };
};

/**
 * uploadAfterImages
 *
 * Uploads field worker's after-repair evidence.
 * Appends to issue.afterImages.
 *
 * Called from:  PATCH /api/workers/tasks/:id/after-images
 * Field name:   'afterImages'
 *
 * Only the assigned FIELD_WORKER may upload after images.
 *
 * @param {string}   issueId  - MongoDB ObjectId
 * @param {Object[]} files    - Array of multer file objects
 * @param {Object}   user     - req.user (FIELD_WORKER)
 */
export const uploadAfterImages = async (issueId, files, user) => {
  if (!files || files.length === 0) {
    const err = new Error('No image files provided');
    err.statusCode = 400;
    throw err;
  }

  const issue = await Issue.findById(issueId);
  if (!issue) {
    const err = new Error('Issue not found');
    err.statusCode = 404;
    throw err;
  }

  // Ownership check
  if (!issue.assignedWorker || issue.assignedWorker.toString() !== user._id.toString()) {
    const err = new Error('Forbidden: This task is not assigned to you');
    err.statusCode = 403;
    throw err;
  }

  const uploadedUrls = await Promise.all(
    files.map((file) =>
      uploadBufferToCloudinary(file.buffer, FOLDERS.after, `after_${issueId}`)
    )
  );

  issue.afterImages.push(...uploadedUrls);
  await issue.save();

  await IssueHistory.create({
    issue:       issueId,
    action:      HISTORY_ACTIONS.PROOF_UPLOADED,
    oldStatus:   issue.status,
    newStatus:   issue.status,
    performedBy: user._id,
    note:        `${uploadedUrls.length} after-repair image(s) uploaded`,
  });

  return { uploadedUrls, issue };
};
