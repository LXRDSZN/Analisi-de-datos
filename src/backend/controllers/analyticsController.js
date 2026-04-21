import analyticsService from '../services/analyticsService.js';
import csvService from '../services/csvService.js';

export const getDashboard = async (req, res) => {
  try {
    const dashboardData = await analyticsService.getDashboardStats();
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener datos del dashboard', error: error.message });
  }
};

export const getSalesByChannel = async (req, res) => {
  try {
    const data = await analyticsService.getSalesByChannel();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas por canal', error: error.message });
  }
};

export const getSalesByStore = async (req, res) => {
  try {
    const data = await analyticsService.getSalesByStore();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas por tienda', error: error.message });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const { startDate, endDate, storeId, channel } = req.query;
    
    let sales = await csvService.getSales();

    if (startDate) {
      sales = sales.filter(s => new Date(s.date) >= new Date(startDate));
    }

    if (endDate) {
      sales = sales.filter(s => new Date(s.date) <= new Date(endDate));
    }

    if (storeId) {
      sales = sales.filter(s => s.store_id === parseInt(storeId));
    }

    if (channel) {
      sales = sales.filter(s => s.channel?.toLowerCase() === channel.toLowerCase());
    }

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
  }
};

export const getDetailedStats = async (req, res) => {
  try {
    const stats = await analyticsService.getDetailedStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas detalladas', error: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await csvService.getCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes', error: error.message });
  }
};

export const getStores = async (req, res) => {
  try {
    const stores = await csvService.getStores();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tiendas', error: error.message });
  }
};

export const getPromotions = async (req, res) => {
  try {
    const promotions = await csvService.getPromotions();
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener promociones', error: error.message });
  }
};
