import PDFDocument from 'pdfkit';
import csvService from '../csvService.js';

class PDFGeneratorService {
  
  async generateWeeklyExecutiveReport() {
    const sales = await csvService.getSales();
    const customers = await csvService.getCustomers();
    const products = await csvService.getProducts();
    
    const reportData = this.prepareReportData(sales, customers, products);
    
    return reportData;
  }
  
  async generateDailySalesReport(date) {
    const sales = await csvService.getSales();
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const dailySales = sales.filter(s => s.date === targetDate);
    
    const reportData = {
      date: targetDate,
      totalRevenue: dailySales.reduce((sum, s) => sum + parseFloat(s.total_value || 0), 0),
      totalOrders: dailySales.length,
      totalQuantity: dailySales.reduce((sum, s) => sum + parseInt(s.quantity || 0), 0),
      byChannel: this.groupByChannel(dailySales)
    };
    
    return reportData;
  }
  
  prepareReportData(sales, customers, products) {
    const last7Days = this.getLast7Days();
    const weekSales = sales.filter(s => last7Days.includes(s.date));
    
    const totalRevenue = weekSales.reduce((sum, s) => sum + parseFloat(s.total_value || 0), 0);
    const totalOrders = weekSales.length;
    
    const byChannel = this.groupByChannel(weekSales);
    const topProducts = this.getTopProducts(weekSales, products, 10);
    const discountSales = this.calculateDiscountSales(weekSales);
    const recurringCustomers = this.getRecurringCustomers(weekSales);
    
    return {
      period: {
        start: last7Days[0],
        end: last7Days[last7Days.length - 1]
      },
      summary: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        averageTicket: totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0,
        totalQuantity: weekSales.reduce((sum, s) => sum + parseInt(s.quantity || 0), 0)
      },
      byChannel,
      topProducts,
      discountSales,
      recurringCustomers,
      generatedAt: new Date().toISOString()
    };
  }
  
  getLast7Days() {
    const dates = [];
    const endDate = new Date('2023-12-31');
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  }
  
  groupByChannel(sales) {
    const channels = {};
    
    sales.forEach(sale => {
      const channel = sale.channel;
      if (!channels[channel]) {
        channels[channel] = {
          revenue: 0,
          orders: 0,
          quantity: 0
        };
      }
      
      channels[channel].revenue += parseFloat(sale.total_value || 0);
      channels[channel].orders += 1;
      channels[channel].quantity += parseInt(sale.quantity || 0);
    });
    
    Object.keys(channels).forEach(channel => {
      channels[channel].averageTicket = channels[channel].orders > 0
        ? parseFloat((channels[channel].revenue / channels[channel].orders).toFixed(2))
        : 0;
      channels[channel].revenue = parseFloat(channels[channel].revenue.toFixed(2));
    });
    
    return channels;
  }
  
  getTopProducts(sales, products, limit) {
    const productSales = {};
    
    sales.forEach(sale => {
      if (!productSales[sale.sku_id]) {
        productSales[sale.sku_id] = {
          quantity: 0,
          revenue: 0
        };
      }
      productSales[sale.sku_id].quantity += parseInt(sale.quantity || 0);
      productSales[sale.sku_id].revenue += parseFloat(sale.total_value || 0);
    });
    
    const productMap = new Map(products.map(p => [p.sku_id, p]));
    
    return Object.entries(productSales)
      .map(([sku_id, data]) => ({
        sku_id,
        name: productMap.get(sku_id)?.sku_name || sku_id,
        category: productMap.get(sku_id)?.category,
        quantity: data.quantity,
        revenue: parseFloat(data.revenue.toFixed(2))
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }
  
  calculateDiscountSales(sales) {
    const withDiscount = sales.filter(s => parseFloat(s.discount_pct || 0) > 0);
    const totalSales = sales.length;
    
    const percentage = totalSales > 0 ? (withDiscount.length / totalSales) * 100 : 0;
    const avgDiscount = withDiscount.length > 0
      ? withDiscount.reduce((sum, s) => sum + parseFloat(s.discount_pct || 0), 0) / withDiscount.length
      : 0;
    
    return {
      count: withDiscount.length,
      percentage: parseFloat(percentage.toFixed(2)),
      avgDiscount: parseFloat(avgDiscount.toFixed(2))
    };
  }
  
  getRecurringCustomers(sales) {
    const customerPurchases = {};
    
    sales.forEach(sale => {
      if (!customerPurchases[sale.customer_id]) {
        customerPurchases[sale.customer_id] = 0;
      }
      customerPurchases[sale.customer_id]++;
    });
    
    const recurring = Object.values(customerPurchases).filter(count => count > 1).length;
    const total = Object.keys(customerPurchases).length;
    
    return {
      count: recurring,
      total: total,
      percentage: total > 0 ? parseFloat(((recurring / total) * 100).toFixed(2)) : 0
    };
  }
}

export default new PDFGeneratorService();
