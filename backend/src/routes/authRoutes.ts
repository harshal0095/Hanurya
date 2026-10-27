import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

const authenticationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
});

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many registrations. Please try again later.' },
});

router.post('/register', registrationLimiter, register);
router.post('/login', authenticationLimiter, login);
router.get('/me', protect, getMe);

export default router;
