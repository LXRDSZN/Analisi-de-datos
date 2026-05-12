import express from 'express';
import dataMiningController from '../../controllers/datamining/dataMiningController.js';
import { verificarToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/cluster-customers', verificarToken, dataMiningController.clusterCustomers);
router.get('/association-rules', verificarToken, dataMiningController.getAssociationRules);
router.get('/predict-sales', verificarToken, dataMiningController.predictSales);

export default router;
