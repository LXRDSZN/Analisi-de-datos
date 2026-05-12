import reportsService from '../../services/reports/reportsService.js';
import pdfGeneratorService from '../../services/reports/pdfGeneratorService.js';

class ReportsController {
  
  /**
   * GET /api/reports/daily-sales
   * Reporte de ventas diarias
   */
  async getDailySales(req, res) {
    try {
      const { date } = req.query;
      const data = await reportsService.getDailySalesReport(date);
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error in getDailySales:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte de ventas diarias',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reports/top-products
   * Reporte de top productos
   */
  async getTopProducts(req, res) {
    try {
      const { period = 'month', limit = 10 } = req.query;
      const data = await reportsService.getTopProductsReport(period, parseInt(limit));
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error in getTopProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte de top productos',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reports/store-performance
   * Reporte de rendimiento por tienda
   */
  async getStorePerformance(req, res) {
    try {
      const data = await reportsService.getStorePerformanceReport();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error in getStorePerformance:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte de rendimiento de tiendas',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reports/average-ticket-by-channel
   * Reporte de ticket promedio por canal
   */
  async getAverageTicketByChannel(req, res) {
    try {
      const data = await reportsService.getAverageTicketByChannelReport();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error in getAverageTicketByChannel:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte de ticket promedio',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reports/discount-sales
   * Reporte de ventas con descuento
   */
  async getDiscountSales(req, res) {
    try {
      const data = await reportsService.getDiscountSalesReport();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error in getDiscountSales:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte de descuentos',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reports/recurring-customers
   * Reporte de clientes recurrentes
   */
  async getRecurringCustomers(req, res) {
    try {
      const data = await reportsService.getRecurringCustomersReport();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error in getRecurringCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte de clientes recurrentes',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reports/weekly-executive
   * Reporte ejecutivo semanal completo
   */
  async getWeeklyExecutive(req, res) {
    try {
      const data = await reportsService.getWeeklyExecutiveReport();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error in getWeeklyExecutive:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte ejecutivo semanal',
        error: error.message
      });
    }
  }
  
  async downloadWeeklyExecutive(req, res) {
    try {
      const data = await pdfGeneratorService.generateWeeklyExecutiveReport();
      res.json({ success: true, data, type: 'downloadable' });
    } catch (error) {
      console.error('Error in downloadWeeklyExecutive:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte para descarga',
        error: error.message
      });
    }
  }
  
  async downloadDailySales(req, res) {
    try {
      const { date } = req.query;
      const data = await pdfGeneratorService.generateDailySalesReport(date);
      res.json({ success: true, data, type: 'downloadable' });
    } catch (error) {
      console.error('Error in downloadDailySales:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reporte de ventas diarias',
        error: error.message
      });
    }
  }
}

export default new ReportsController();
