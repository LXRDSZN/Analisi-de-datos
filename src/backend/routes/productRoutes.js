import { Router } from 'express';
import { getAllProducts, getProductById, filterProducts, getCategories } from '../controllers/productController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verificarToken, getAllProducts);
router.get('/filter', verificarToken, filterProducts);
router.get('/categories', verificarToken, getCategories);
router.get('/:id', verificarToken, getProductById);

export default router;
