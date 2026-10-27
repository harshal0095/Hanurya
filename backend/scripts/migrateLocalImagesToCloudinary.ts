import { basename, isAbsolute, relative, resolve } from 'path';
import { existsSync } from 'fs';
import { prisma } from '../src/utils/prisma';
import { cloudinary, usesCloudinaryStorage } from '../src/utils/cloudinary';

const localUploadDirectory = resolve(__dirname, '../../public/uploads');

async function migrateLocalProductImages(): Promise<void> {
  if (!usesCloudinaryStorage) {
    throw new Error('Configure valid Cloudinary credentials before migrating product images.');
  }

  const products = await prisma.product.findMany({
    where: { imageUrl: { startsWith: '/uploads/' } },
    select: { id: true, name: true, imageUrl: true },
  });

  for (const product of products) {
    if (!product.imageUrl) continue;

    const filename = basename(product.imageUrl);
    if (filename !== product.imageUrl.slice('/uploads/'.length)) {
      throw new Error(`Unsafe local image path found for product "${product.name}".`);
    }

    const localImagePath = resolve(localUploadDirectory, filename);
    const relativeImagePath = relative(localUploadDirectory, localImagePath);
    if (relativeImagePath.startsWith('..') || isAbsolute(relativeImagePath) || !existsSync(localImagePath)) {
      throw new Error(`Local image file is missing for product "${product.name}".`);
    }

    const uploaded = await cloudinary.uploader.upload(localImagePath, {
      folder: 'hanurya_products',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    });
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: uploaded.secure_url },
    });
    console.log(`Migrated image for "${product.name}" to persistent cloud storage.`);
  }

  console.log(`Image migration complete. ${products.length} product image(s) checked.`);
}

migrateLocalProductImages()
  .catch((error: unknown) => {
    console.error('Product image migration failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
