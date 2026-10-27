import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { ensureDefaultCollections } from '../utils/defaultCollections';

export const getCollections = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await ensureDefaultCollections(prisma);
    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(collections);
  } catch (error) {
    next(error);
  }
};

export const createCollection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
    const slug = name
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (!name || !slug) {
      res.status(400).json({ message: 'Enter a category name using letters or numbers' });
      return;
    }

    await ensureDefaultCollections(prisma);
    const existingCollection = await prisma.collection.findUnique({ where: { slug } });
    const collection = existingCollection
      ? await prisma.collection.update({
          where: { slug },
          data: { name, description, isActive: true },
        })
      : await prisma.collection.create({ data: { name, slug, description } });

    res.status(201).json(collection);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      res.status(409).json({ message: 'A category with that name already exists' });
      return;
    }
    next(error);
  }
};

export const updateCollection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const currentCollection = await prisma.collection.findUnique({ where: { slug } });
    if (!currentCollection || !currentCollection.isActive) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
    if (!name) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }

    const collection = await prisma.collection.update({
      where: { slug },
      data: { name, description },
    });
    res.json(collection);
  } catch (error) {
    next(error);
  }
};

export const deleteCollection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const collection = await prisma.collection.findUnique({ where: { slug } });
    if (!collection || !collection.isActive) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const productCount = await prisma.product.count({ where: { collectionSlug: slug } });
    if (productCount > 0) {
      res.status(409).json({ message: 'Move or delete this category’s products before deleting the category.' });
      return;
    }

    await prisma.collection.update({ where: { slug }, data: { isActive: false } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};