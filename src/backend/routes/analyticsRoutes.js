import { Router } from 'express';
import { 
  getDashboard, 
  getSalesByChannel, 
  getSalesByStore, 
  getSalesData,
  getDetailedStats,
  getCustomers,
  getStores,
  getPromotions
} from '../controllers/analyticsController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', verificarToken, getDashboard);
router.get('/sales-by-channel', verificarToken, getSalesByChannel);
router.get('/sales-by-store', verificarToken, getSalesByStore);
router.get('/sales', verificarToken, getSalesData);
router.get('/detailed-stats', verificarToken, getDetailedStats);
router.get('/customers', verificarToken, getCustomers);
router.get('/stores', verificarToken, getStores);
router.get('/promotions', verificarToken, getPromotions);

export default router;
