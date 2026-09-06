import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'pdf'];

function folderFor(req) {
  const folder = req.query.folder || req.body.folder || 'siyb/misc';
  const allowed = ['siyb/team', 'siyb/programs', 'siyb/stories', 'siyb/products', 'siyb/docs', 'siyb/misc'];
  return allowed.includes(folder) ? folder : 'siyb/misc';
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: folderFor(req),
    allowed_formats: ALLOWED_FORMATS,
    resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
  }),
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
