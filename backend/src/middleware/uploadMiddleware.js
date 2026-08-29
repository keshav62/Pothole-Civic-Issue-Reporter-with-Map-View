import multer from 'multer';

// ─── Constants ────────────────────────────────────────────────────────────────

// Allowed MIME types — backend enforces this regardless of what the frontend sends
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

// 5 MB per file
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Maximum number of files per upload request
const MAX_FILES = 5;

// ─── Storage: memory ─────────────────────────────────────────────────────────
// Files are held in RAM as Buffer objects.
// They are streamed directly to Cloudinary by imageService — never written to disk.

const storage = multer.memoryStorage();

// ─── File filter ──────────────────────────────────────────────────────────────

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type '${file.mimetype}'. ` +
        `Allowed types: ${[...ALLOWED_MIME_TYPES].join(', ')}`
      ),
      false
    );
  }
};

// ─── Multer instance ──────────────────────────────────────────────────────────

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files:    MAX_FILES,
  },
});

// ─── Exported middleware factories ────────────────────────────────────────────

/**
 * uploadImages(fieldName)
 *
 * Accepts up to MAX_FILES images under the given form-data field name.
 * Wraps multer errors into a consistent JSON response.
 *
 * Usage in routes:
 *   router.post('/', uploadImages('images'), createIssue);
 */
export const uploadImages = (fieldName) => (req, res, next) => {
  const middleware = upload.array(fieldName, MAX_FILES);

  middleware(req, res, (err) => {
    if (!err) return next();

    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum allowed size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB per file.`,
      });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: `Too many files. Maximum allowed is ${MAX_FILES} files per upload.`,
      });
    }

    // File type errors thrown by fileFilter
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error',
    });
  });
};

/**
 * uploadSingleImage(fieldName)
 *
 * Accepts exactly one image. Useful for profile photo endpoints.
 */
export const uploadSingleImage = (fieldName) => (req, res, next) => {
  const middleware = upload.single(fieldName);

  middleware(req, res, (err) => {
    if (!err) return next();

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum allowed size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`,
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error',
    });
  });
};

export { MAX_FILE_SIZE_BYTES, MAX_FILES, ALLOWED_MIME_TYPES };
