import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { protect, admin } from '../middlewares/authMiddleware';
import { upload } from '../utils/cloudinary';

const router = Router();

// GET all products
router.get('/', getProducts);

// GET single product
router.get('/:id', getProductById);

// POST a new product (Admin only, handles image upload)
router.post('/', protect, admin, upload.single('image'), createProduct);
router.put('/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
