import mongoose from 'mongoose';

// ─── Seed values (exported for reference / seeding scripts) ──────────────────
export const DEFAULT_DEPARTMENTS = [
  { name: 'Road Maintenance', code: 'ROAD' },
  { name: 'Sanitation',       code: 'SANITATION' },
  { name: 'Electricity',      code: 'ELECTRICITY' },
  { name: 'Water Supply',     code: 'WATER' },
  { name: 'Drainage',         code: 'DRAINAGE' },
];

// ─── Schema ──────────────────────────────────────────────────────────────────

const departmentSchema = new mongoose.Schema(
  {
    // Full display name shown in the UI (e.g. "Road Maintenance")
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Short uppercase identifier used for internal filtering and assignment
    // (e.g. "ROAD", "SANITATION"). Must be unique across departments.
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    // Optional longer description of what the department handles
    description: {
      type: String,
      trim: true,
      default: '',
    },

    // Contact details for the department (used in admin views and escalations)
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },

    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },

    // Soft-delete flag — deactivated departments cannot receive new issues
    // but historical data stays intact
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    // Adds createdAt and updatedAt automatically
    timestamps: true,
  }
);

// ─── Model ───────────────────────────────────────────────────────────────────

const Department = mongoose.model('Department', departmentSchema);

export default Department;

