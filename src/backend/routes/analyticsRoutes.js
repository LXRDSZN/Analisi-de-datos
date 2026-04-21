import { Router } from 'express';
import { getDashboard, getSalesByChannel, getSalesByStore, getSalesData } from '../controllers/analyticsController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', verificarToken, getDashboard);
router.get('/sales-by-channel', verificarToken, getSalesByChannel);
router.get('/sales-by-store', verificarToken, getSalesByStore);
router.get('/sales', verificarToken, getSalesData);

export default router;
