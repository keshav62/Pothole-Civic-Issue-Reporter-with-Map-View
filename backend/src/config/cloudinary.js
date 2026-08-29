import { v2 as cloudinary } from 'cloudinary';

const requiredVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

for (const v of requiredVars) {
  if (!process.env[v]) {
    throw new Error(`Missing Cloudinary env var: ${v}`);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,   // always use HTTPS URLs
});

export default cloudinary;
