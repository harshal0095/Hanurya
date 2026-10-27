import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { resolve } from 'path';

const cloudinaryCredentials = [
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET,
].map((value) => value?.trim() || '');

const hasCloudinaryCredentials = cloudinaryCredentials.every(
  (value) => value.length > 0 && !/^(your_|placeholder|example|change.?me)/i.test(value),
);

export const usesCloudinaryStorage = hasCloudinaryCredentials;

if (usesCloudinaryStorage) {
  cloudinary.config({
    cloud_name: cloudinaryCredentials[0],
    api_key: cloudinaryCredentials[1],
    api_secret: cloudinaryCredentials[2],
  });
}

const localUploadDirectory = resolve(__dirname, '../../../public/uploads');
if (!usesCloudinaryStorage) mkdirSync(localUploadDirectory, { recursive: true });

const storage = usesCloudinaryStorage
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, callback) => callback(null, localUploadDirectory),
      filename: (_req, file, callback) => {
        const extension = file.mimetype === 'image/png' ? '.png' : file.mimetype === 'image/webp' ? '.webp' : '.jpg';
        callback(null, `${randomUUID()}${extension}`);
      },
    });

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new Error('Only JPEG, PNG, and WebP images are allowed.'));
  },
});

export async function getUploadedImageUrl(file: Express.Multer.File): Promise<string> {
  if (!usesCloudinaryStorage) return `/uploads/${file.filename}`;

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'hanurya_products', allowed_formats: ['jpg', 'png', 'jpeg', 'webp'] },
      (error, uploadedImage) => {
        if (error) {
          reject(error);
        } else if (!uploadedImage) {
          reject(new Error('Cloudinary did not return an uploaded image.'));
        } else {
          resolve(uploadedImage);
        }
      },
    );
    stream.end(file.buffer);
  });

  return result.secure_url;
}

export { cloudinary };
