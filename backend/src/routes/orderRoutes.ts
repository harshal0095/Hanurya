import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import {
  createOrder,
  getAdminOrders,
  getMyOrder,
  getMyOrders,
  quoteOrder,
  updateAdminOrderStatus,
} from '../controllers/orderController';
import { admin, protect } from '../middlewares/authMiddleware';

const router = Router();
const orderSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});
const orderQuoteLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/quote', orderQuoteLimiter, quoteOrder);
router.post('/', protect, orderSubmissionLimiter, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/mine/:id', protect, getMyOrder);
router.get('/admin', protect, admin, getAdminOrders);
router.patch('/admin/:id/status', protect, admin, updateAdminOrderStatus);

export default router;
