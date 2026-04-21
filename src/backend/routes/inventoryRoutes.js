import { Router } from 'express';
import { getInventory, getLowStock } from '../controllers/inventoryController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verificarToken, getInventory);
router.get('/low-stock', verificarToken, getLowStock);

export default router;
