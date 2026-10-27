import { Router } from 'express';
import { createCollection, deleteCollection, getCollections, updateCollection } from '../controllers/collectionController';
import { admin, protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getCollections);
router.post('/', protect, admin, createCollection);
router.put('/:slug', protect, admin, updateCollection);
router.delete('/:slug', protect, admin, deleteCollection);

export default router;