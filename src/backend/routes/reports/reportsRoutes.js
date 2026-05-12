import express from 'express';
import reportsController from '../../controllers/reports/reportsController.js';
import { verificarToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/reports/daily-sales
 * Reporte de ventas totales diarias
 * Query: date (YYYY-MM-DD, opcional)
 */
router.get('/daily-sales', verificarToken, reportsController.getDailySales);

/**
 * GET /api/reports/top-products
 * Reporte de top productos
 * Query: period (day|week|month|quarter|year), limit (número)
 */
router.get('/top-products', verificarToken, reportsController.getTopProducts);

/**
 * GET /api/reports/store-performance
 * Reporte de rendimiento por tienda
 */
router.get('/store-performance', verificarToken, reportsController.getStorePerformance);

/**
 * GET /api/reports/average-ticket-by-channel
 * Reporte de ticket promedio por canal
 */
router.get('/average-ticket-by-channel', verificarToken, reportsController.getAverageTicketByChannel);

/**
 * GET /api/reports/discount-sales
 * Reporte de % de ventas con descuento
 */
router.get('/discount-sales', verificarToken, reportsController.getDiscountSales);

/**
 * GET /api/reports/recurring-customers
 * Reporte de clientes recurrentes
 */
router.get('/recurring-customers', verificarToken, reportsController.getRecurringCustomers);

/**
 * GET /api/reports/weekly-executive
 * Reporte ejecutivo semanal completo
 */
router.get('/weekly-executive', verificarToken, reportsController.getWeeklyExecutive);

router.get('/download/weekly-executive', verificarToken, reportsController.downloadWeeklyExecutive);
router.get('/download/daily-sales', verificarToken, reportsController.downloadDailySales);

export default router;
