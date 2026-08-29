import { v2 as cloudinary } from 'cloudinary';

const requiredVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const missing = requiredVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.warn(`⚠️  Cloudinary env vars missing (${missing.join(', ')}). Image uploads will be disabled.`);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:     true,
  });
}

export default cloudinary;
