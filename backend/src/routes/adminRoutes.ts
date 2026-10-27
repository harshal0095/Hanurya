import { Router } from 'express';
import { getStats } from '../controllers/adminController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/stats', protect, admin, getStats);

export default router;
