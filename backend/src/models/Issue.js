import mongoose from 'mongoose';
import './User.js';
import './Department.js';

// ─── Enums (exported so controllers/validators can reuse them) ───────────────

export const ISSUE_CATEGORIES = [
  'POTHOLE',
  'GARBAGE',
  'STREETLIGHT',
  'DRAINAGE',
  'ROAD_DAMAGE',
  'WATER_LEAK',
  'OTHER',
];

export const ISSUE_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const ISSUE_STATUSES = [
  'REPORTED',                   // Citizen submitted the issue
  'VERIFIED',                   // Admin/Officer confirmed it is legitimate
  'REJECTED',                   // Admin determined it is invalid / duplicate
  'ASSIGNED',                   // Department + field worker assigned
  'ACCEPTED',                   // Field worker accepted the task
  'IN_PROGRESS',                // Field worker has started work on-site
  'PENDING_CITIZEN_VERIFICATION', // Worker marked done, awaiting citizen confirmation
  'CITIZEN_VERIFIED',           // Citizen confirmed the fix
  'REOPENED',                   // Citizen rejected the resolution
  'RESOLVED',                   // Administratively closed
];

// ─── Schema ──────────────────────────────────────────────────────────────────

const issueSchema = new mongoose.Schema(
  {
    // Human-readable identifier (e.g. "ISS-1021") generated before save
    issueId: {
      type: String,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: ISSUE_CATEGORIES,
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: ISSUE_PRIORITIES,
      default: 'MEDIUM',
      index: true,
    },

    status: {
      type: String,
      enum: ISSUE_STATUSES,
      default: 'REPORTED',
      index: true,
    },

    // ── Location ──────────────────────────────────────────────────────────
    // GeoJSON Point — coordinates are ALWAYS [longitude, latitude].
    // This is the GeoJSON / MongoDB standard.
    // IMPORTANT: longitude comes FIRST, latitude comes SECOND.
    // Most mapping tools (Google Maps, Leaflet) give you (lat, lng) —
    // you must SWAP the order before storing here.
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: ([lng, lat]) =>
            lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
          message:
            'Coordinates must be valid [longitude, latitude] values',
        },
      },
    },

    // Human-readable address line (reverse-geocoded or typed by citizen)
    address: {
      type: String,
      trim: true,
    },

    // Ward / administrative zone (e.g. "Ward 15")
    ward: {
      type: String,
      trim: true,
      index: true,
    },

    // ── People ────────────────────────────────────────────────────────────
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Set after Admin assigns a department
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department', // Department model will be created in Phase 4
      default: null,
    },

    // Set after Department Admin assigns a worker
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ── Images ────────────────────────────────────────────────────────────
    // General images uploaded at report time
    images: {
      type: [String], // Cloudinary URLs
      default: [],
    },

    // Evidence uploaded by the field worker BEFORE starting work
    beforeImages: {
      type: [String], // Cloudinary URLs
      default: [],
    },

    // Evidence uploaded by the field worker AFTER completing work
    afterImages: {
      type: [String], // Cloudinary URLs
      default: [],
    },

    // ── AI Analysis (Planned) ─────────────────────────────────────────────
    // Populated by the AI service after image classification.
    // Stored as a subdocument so it can be added later without migrations.
    aiAnalysis: {
      detectedCategory: { type: String, default: null },
      severity: { type: String, default: null },
      confidence: { type: Number, default: null }, // 0.0 – 1.0
      isDuplicate: { type: Boolean, default: false },
      duplicateOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue',
        default: null,
      },
      analyzedAt: { type: Date, default: null },
    },

    // ── Dates ─────────────────────────────────────────────────────────────
    // SLA deadline — set when issue is assigned
    dueDate: {
      type: Date,
      default: null,
    },

    // Set when status transitions to RESOLVED or CITIZEN_VERIFIED
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    // Adds createdAt and updatedAt automatically
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

// 2dsphere index required for MongoDB geospatial queries
// ($near, $geoWithin, $geoIntersects)
issueSchema.index({ location: '2dsphere' });

// Compound index for the most common admin list query:
// "show all HIGH priority issues with status REPORTED, newest first"
issueSchema.index({ status: 1, priority: 1, createdAt: -1 });

// ─── Pre-save hook: generate issueId ─────────────────────────────────────────

issueSchema.pre('save', async function () {
  if (!this.issueId) {
    const count = await mongoose.model('Issue').countDocuments();
    this.issueId = `ISS-${String(count + 1).padStart(4, '0')}`;
  }
});

// ─── Model ───────────────────────────────────────────────────────────────────

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;

