import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { getUploadedImageUrl } from '../utils/cloudinary';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { collection: true },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id as string },
      include: { collection: true },
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, stock, collectionSlug } = req.body;

    if (typeof collectionSlug !== 'string' || !collectionSlug.trim()) {
      res.status(400).json({ message: 'A collection is required' });
      return;
    }

    const collection = await prisma.collection.findUnique({
      where: { slug: collectionSlug.trim(), isActive: true },
    });
    if (!collection) {
      res.status(400).json({ message: 'Choose a valid collection' });
      return;
    }

    const imageUrl = req.file ? await getUploadedImageUrl(req.file) : null;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        collectionSlug: collectionSlug.trim(),
        stock: parseInt(stock, 10) || 0,
        imageUrl,
      },
      include: { collection: true },
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const currentProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!currentProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const { name, description, price, stock, collectionSlug } = req.body;
    const collection = await prisma.collection.findUnique({
      where: { slug: String(collectionSlug || '').trim(), isActive: true },
    });
    if (!collection) {
      res.status(400).json({ message: 'Choose a valid collection' });
      return;
    }

    const parsedPrice = Number(price);
    const parsedStock = Number.parseInt(stock, 10);
    if (!String(name || '').trim() || !String(description || '').trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0 || !Number.isInteger(parsedStock) || parsedStock < 0) {
      res.status(400).json({ message: 'Enter valid product details' });
      return;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: String(name).trim(),
        description: String(description).trim(),
        price: parsedPrice,
        stock: parsedStock,
        collectionSlug: collection.slug,
        ...(req.file ? { imageUrl: await getUploadedImageUrl(req.file) } : {}),
      },
      include: { collection: true },
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const orderItemCount = await prisma.orderItem.count({ where: { productId } });
    if (orderItemCount > 0) {
      res.status(409).json({ message: 'This product is linked to an order and cannot be deleted.' });
      return;
    }

    await prisma.product.delete({ where: { id: productId } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
