import express from 'express';
import channelMartController from '../../controllers/datamart/channelMartController.js';
import { verificarToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/datamart/channels
 * Obtiene análisis de todos los canales
 */
router.get('/channels', verificarToken, channelMartController.getAllChannels);

/**
 * GET /api/datamart/channels/:channel
 * Obtiene análisis de un canal específico
 * Params: channel (Store|Website|MobileApp|Amazon.ae|Noon)
 */
router.get('/channels/:channel', verificarToken, channelMartController.getChannelAnalysis);

export default router;
