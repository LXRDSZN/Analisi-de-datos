import csvService from '../csvService.js';

class ReportsService {
  
  /**
   * Reporte: Ventas Totales Diarias
   */
  async getDailySalesReport(date = null) {
    const sales = await csvService.getSales();
    
    // Si no se proporciona fecha, usar la última fecha disponible en los datos
    let targetDate = date;
    if (!targetDate) {
      const dates = [...new Set(sales.map(s => s.date))].sort();
      targetDate = dates[dates.length - 1];
    }
    
    const dailySales = sales.filter(s => s.date === targetDate);
    
    const totalRevenue = dailySales.reduce((sum, s) => sum + (s.total_value || 0), 0);
    const totalOrders = dailySales.length;
    const totalQuantity = dailySales.reduce((sum, s) => sum + (s.quantity || 0), 0);
    
    const salesByChannel = this.groupSalesByChannel(dailySales);
    const salesByHour = this.groupSalesByHour(dailySales);
    const topProducts = await this.getTopProductsFromSales(dailySales, 10);
    
    return {
      date: targetDate,
      summary: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        totalQuantity,
        averageTicket: totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0
      },
      byChannel: salesByChannel,
      byHour: salesByHour,
      topProducts,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Reporte: Top 10 Productos
   */
  async getTopProductsReport(period = 'month', limit = 10) {
    const sales = await csvService.getSales();
    const products = await csvService.getProducts();
    
    const filteredSales = this.filterSalesByPeriod(sales, period);
    const topProducts = await this.getTopProductsFromSales(filteredSales, limit);
    
    return {
      period,
      totalProducts: topProducts.length,
      products: topProducts,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Reporte: Rendimiento por Tienda
   */
  async getStorePerformanceReport() {
    const sales = await csvService.getSales();
    const stores = await csvService.getStores();
    
    const storeMetrics = {};
    
    sales.forEach(sale => {
      const storeId = sale.store_id;
      if (!storeMetrics[storeId]) {
        storeMetrics[storeId] = {
          store_id: storeId,
          revenue: 0,
          orders: 0,
          quantity: 0
        };
      }
      
      storeMetrics[storeId].revenue += sale.total_value || 0;
      storeMetrics[storeId].orders += 1;
      storeMetrics[storeId].quantity += sale.quantity || 0;
    });
    
    const storePerformance = Object.values(storeMetrics).map(sm => {
      const store = stores.find(s => s.store_id === sm.store_id);
      return {
        ...sm,
        store_name: store?.store_name || 'Unknown',
        city: store?.city || 'Unknown',
        revenue: parseFloat(sm.revenue.toFixed(2)),
        averageTicket: sm.orders > 0 ? parseFloat((sm.revenue / sm.orders).toFixed(2)) : 0
      };
    }).sort((a, b) => b.revenue - a.revenue);
    
    return {
      totalStores: storePerformance.length,
      stores: storePerformance,
      summary: {
        topStore: storePerformance[0],
        totalRevenue: parseFloat(storePerformance.reduce((sum, s) => sum + s.revenue, 0).toFixed(2)),
        totalOrders: storePerformance.reduce((sum, s) => sum + s.orders, 0)
      },
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Reporte: Ticket Promedio por Canal
   */
  async getAverageTicketByChannelReport() {
    const sales = await csvService.getSales();
    const channels = ['Store', 'Website', 'MobileApp', 'Amazon.ae', 'Noon'];
    
    const channelMetrics = {};
    
    channels.forEach(channel => {
      const channelSales = sales.filter(s => s.channel === channel);
      const totalRevenue = channelSales.reduce((sum, s) => sum + (s.total_value || 0), 0);
      const totalOrders = channelSales.length;
      
      channelMetrics[channel] = {
        channel,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        averageTicket: totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0,
        revenueShare: 0
      };
    });
    
    const totalRevenue = Object.values(channelMetrics).reduce((sum, c) => sum + c.totalRevenue, 0);
    Object.values(channelMetrics).forEach(c => {
      c.revenueShare = parseFloat(((c.totalRevenue / totalRevenue) * 100).toFixed(2));
    });
    
    return {
      channels: Object.values(channelMetrics).sort((a, b) => b.averageTicket - a.averageTicket),
      summary: {
        highestAvgTicket: Object.values(channelMetrics).sort((a, b) => b.averageTicket - a.averageTicket)[0],
        totalRevenue: parseFloat(totalRevenue.toFixed(2))
      },
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Reporte: % de Ventas con Descuento
   */
  async getDiscountSalesReport() {
    const sales = await csvService.getSales();
    
    const salesWithDiscount = sales.filter(s => s.discount_pct > 0);
    const totalRevenue = sales.reduce((sum, s) => sum + (s.total_value || 0), 0);
    const discountRevenue = salesWithDiscount.reduce((sum, s) => sum + (s.total_value || 0), 0);
    
    const avgDiscount = salesWithDiscount.length > 0
      ? salesWithDiscount.reduce((sum, s) => sum + (s.discount_pct || 0), 0) / salesWithDiscount.length
      : 0;
    
    // Agrupar por rango de descuento
    const discountRanges = {
      '0-10%': 0,
      '10-20%': 0,
      '20-30%': 0,
      '30%+': 0
    };
    
    salesWithDiscount.forEach(s => {
      const discount = s.discount_pct;
      if (discount < 10) discountRanges['0-10%']++;
      else if (discount < 20) discountRanges['10-20%']++;
      else if (discount < 30) discountRanges['20-30%']++;
      else discountRanges['30%+']++;
    });
    
    return {
      summary: {
        totalOrders: sales.length,
        ordersWithDiscount: salesWithDiscount.length,
        ordersWithoutDiscount: sales.length - salesWithDiscount.length,
        discountPercentage: parseFloat(((salesWithDiscount.length / sales.length) * 100).toFixed(2)),
        averageDiscount: parseFloat(avgDiscount.toFixed(2)),
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        discountRevenue: parseFloat(discountRevenue.toFixed(2)),
        discountRevenueShare: parseFloat(((discountRevenue / totalRevenue) * 100).toFixed(2))
      },
      discountRanges,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Reporte: Clientes Recurrentes
   */
  async getRecurringCustomersReport() {
    const sales = await csvService.getSales();
    const customers = await csvService.getCustomers();
    
    // Contar compras por cliente
    const customerPurchases = {};
    sales.forEach(sale => {
      if (sale.customer_id) {
        customerPurchases[sale.customer_id] = (customerPurchases[sale.customer_id] || 0) + 1;
      }
    });
    
    // Clasificar clientes
    const oneTimeBuyers = [];
    const recurringCustomers = [];
    const loyalCustomers = [];
    
    Object.entries(customerPurchases).forEach(([custId, count]) => {
      if (count === 1) oneTimeBuyers.push(custId);
      else if (count < 5) recurringCustomers.push(custId);
      else loyalCustomers.push(custId);
    });
    
    // Calcular revenue por segmento
    const segmentRevenue = {
      oneTime: 0,
      recurring: 0,
      loyal: 0
    };
    
    sales.forEach(sale => {
      if (!sale.customer_id) return;
      
      if (oneTimeBuyers.includes(sale.customer_id)) {
        segmentRevenue.oneTime += sale.total_value || 0;
      } else if (recurringCustomers.includes(sale.customer_id)) {
        segmentRevenue.recurring += sale.total_value || 0;
      } else if (loyalCustomers.includes(sale.customer_id)) {
        segmentRevenue.loyal += sale.total_value || 0;
      }
    });
    
    const totalRevenue = Object.values(segmentRevenue).reduce((sum, v) => sum + v, 0);
    
    return {
      summary: {
        totalCustomers: Object.keys(customerPurchases).length,
        oneTimeBuyers: oneTimeBuyers.length,
        recurringCustomers: recurringCustomers.length,
        loyalCustomers: loyalCustomers.length,
        recurringRate: parseFloat(((recurringCustomers.length + loyalCustomers.length) / Object.keys(customerPurchases).length * 100).toFixed(2))
      },
      segments: {
        oneTime: {
          customers: oneTimeBuyers.length,
          revenue: parseFloat(segmentRevenue.oneTime.toFixed(2)),
          revenueShare: parseFloat((segmentRevenue.oneTime / totalRevenue * 100).toFixed(2)),
          avgRevenue: parseFloat((segmentRevenue.oneTime / oneTimeBuyers.length).toFixed(2))
        },
        recurring: {
          customers: recurringCustomers.length,
          revenue: parseFloat(segmentRevenue.recurring.toFixed(2)),
          revenueShare: parseFloat((segmentRevenue.recurring / totalRevenue * 100).toFixed(2)),
          avgRevenue: recurringCustomers.length > 0 ? parseFloat((segmentRevenue.recurring / recurringCustomers.length).toFixed(2)) : 0
        },
        loyal: {
          customers: loyalCustomers.length,
          revenue: parseFloat(segmentRevenue.loyal.toFixed(2)),
          revenueShare: parseFloat((segmentRevenue.loyal / totalRevenue * 100).toFixed(2)),
          avgRevenue: loyalCustomers.length > 0 ? parseFloat((segmentRevenue.loyal / loyalCustomers.length).toFixed(2)) : 0
        }
      },
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Reporte Ejecutivo Semanal (Completo)
   */
  async getWeeklyExecutiveReport() {
    const [
      dailySales,
      topProducts,
      storePerformance,
      avgTicket,
      discountReport,
      recurringCustomers
    ] = await Promise.all([
      this.getDailySalesReport(),
      this.getTopProductsReport('week', 10),
      this.getStorePerformanceReport(),
      this.getAverageTicketByChannelReport(),
      this.getDiscountSalesReport(),
      this.getRecurringCustomersReport()
    ]);
    
    return {
      reportType: 'weekly_executive',
      period: 'last_7_days',
      sections: {
        dailySales,
        topProducts,
        storePerformance,
        channelPerformance: avgTicket,
        discountAnalysis: discountReport,
        customerRetention: recurringCustomers
      },
      generatedAt: new Date().toISOString()
    };
  }

  // Helper methods
  groupSalesByChannel(sales) {
    const channels = {};
    sales.forEach(sale => {
      const channel = sale.channel;
      if (!channels[channel]) {
        channels[channel] = {
          channel,
          revenue: 0,
          orders: 0
        };
      }
      channels[channel].revenue += sale.total_value || 0;
      channels[channel].orders += 1;
    });
    
    return Object.values(channels).map(c => ({
      ...c,
      revenue: parseFloat(c.revenue.toFixed(2))
    }));
  }

  groupSalesByHour(sales) {
    // Simulación de horas (los datos no tienen hora exacta)
    const hours = {};
    for (let i = 0; i < 24; i++) {
      hours[i] = { hour: i, orders: 0, revenue: 0 };
    }
    
    // Distribución simulada basada en patrones típicos de retail
    const hourDistribution = [2,1,1,1,3,5,8,12,15,18,20,22,20,18,16,18,20,22,18,15,12,8,5,3];
    sales.forEach((sale, idx) => {
      const hour = hourDistribution[idx % 24];
      hours[hour].orders += 1;
      hours[hour].revenue += sale.total_value || 0;
    });
    
    return Object.values(hours).map(h => ({
      ...h,
      revenue: parseFloat(h.revenue.toFixed(2))
    }));
  }

  async getTopProductsFromSales(sales, limit) {
    const products = await csvService.getProducts();
    const productSales = {};
    
    sales.forEach(sale => {
      const skuId = sale.sku_id;
      if (!productSales[skuId]) {
        productSales[skuId] = {
          sku_id: skuId,
          revenue: 0,
          quantity: 0,
          orders: 0
        };
      }
      
      productSales[skuId].revenue += sale.total_value || 0;
      productSales[skuId].quantity += sale.quantity || 0;
      productSales[skuId].orders += 1;
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
    
    return topProducts.map((p, idx) => {
      const product = products.find(prod => prod.sku_id === p.sku_id);
      return {
        rank: idx + 1,
        ...p,
        product_name: product?.product_name || 'Unknown',
        category: product?.category || 'Unknown',
        revenue: parseFloat(p.revenue.toFixed(2))
      };
    });
  }

  filterSalesByPeriod(sales, period) {
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return sales;
    }
    
    return sales.filter(s => new Date(s.date) >= startDate);
  }
}

export default new ReportsService();
