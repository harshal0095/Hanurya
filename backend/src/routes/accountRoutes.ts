import { Router } from 'express';
import { getCart, getWishlist, replaceCart, replaceWishlist } from '../controllers/accountController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/cart', protect, getCart);
router.put('/cart', protect, replaceCart);
router.get('/wishlist', protect, getWishlist);
router.put('/wishlist', protect, replaceWishlist);

export default router;
