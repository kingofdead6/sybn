import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

/**
 * Read credentials lazily. Configuring at import time is fragile: ES module
 * imports are hoisted, so this module can evaluate before the entrypoint has
 * loaded .env, which silently captures undefined credentials and makes every
 * upload fail with a 500.
 */
function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw Object.assign(new Error('Cloudinary is not configured on the server'), { status: 500 });
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'pdf'];

function folderFor(req) {
  const folder = req.query.folder || req.body.folder || 'siyb/misc';
  const allowed = ['siyb/team', 'siyb/programs', 'siyb/stories', 'siyb/products', 'siyb/docs', 'siyb/misc'];
  return allowed.includes(folder) ? folder : 'siyb/misc';
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Applied per request, by which point .env is definitely loaded.
    configureCloudinary();
    return {
      folder: folderFor(req),
      allowed_formats: ALLOWED_FORMATS,
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'].includes(file.mimetype);
    cb(ok ? null : new Error('Unsupported file type'), ok);
  },
});

export { cloudinary };
