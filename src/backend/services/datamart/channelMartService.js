import csvService from '../csvService.js';

class ChannelMartService {
  
  /**
   * Data Mart: Análisis completo por Canal
   * Canales: Store, Website, MobileApp, Amazon.ae, Noon
   */
  async getChannelMart(channel = null) {
    const sales = await csvService.getSales();
    const products = await csvService.getProducts();
    const customers = await csvService.getCustomers();
    
    const channelData = channel 
      ? sales.filter(s => s.channel === channel)
      : sales;
    
    // Agrupar por canal si no se especifica uno
    if (!channel) {
      return this.getAllChannelsAnalysis(sales, products, customers);
    }
    
    // Análisis específico de un canal
    return this.getChannelAnalysis(channel, channelData, products, customers);
  }

  getAllChannelsAnalysis(sales, products, customers) {
    const channels = ['Store', 'Website', 'MobileApp', 'Amazon.ae', 'Noon'];
    const result = {};
    
    channels.forEach(channel => {
      const channelSales = sales.filter(s => s.channel === channel);
      result[channel] = this.calculateChannelMetrics(channelSales, products, customers);
    });
    
    return {
      channels: result,
      summary: this.generateChannelsSummary(result)
    };
  }

  getChannelAnalysis(channel, channelSales, products, customers) {
    return {
      channel,
      metrics: this.calculateChannelMetrics(channelSales, products, customers),
      trends: this.calculateChannelTrends(channelSales),
      topProducts: this.getChannelTopProducts(channelSales, products),
      customerProfile: this.getChannelCustomerProfile(channelSales, customers)
    };
  }

  calculateChannelMetrics(channelSales, products, customers) {
    const totalRevenue = channelSales.reduce((sum, s) => sum + (s.total_value || 0), 0);
    const totalQuantity = channelSales.reduce((sum, s) => sum + (s.quantity || 0), 0);
    const totalOrders = channelSales.length;
    
    const salesWithDiscount = channelSales.filter(s => s.discount_pct > 0);
    const discountRevenue = salesWithDiscount.reduce((sum, s) => sum + (s.total_value || 0), 0);
    
    const avgDiscount = salesWithDiscount.length > 0
      ? salesWithDiscount.reduce((sum, s) => sum + (s.discount_pct || 0), 0) / salesWithDiscount.length
      : 0;
    
    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalQuantity,
      totalOrders,
      averageTicket: totalOrders > 0 ? parseFloat((totalRevenue / totalOrders).toFixed(2)) : 0,
      averageItemsPerOrder: totalOrders > 0 ? parseFloat((totalQuantity / totalOrders).toFixed(2)) : 0,
      ordersWithDiscount: salesWithDiscount.length,
      discountPercentage: totalOrders > 0 ? parseFloat(((salesWithDiscount.length / totalOrders) * 100).toFixed(2)) : 0,
      averageDiscount: parseFloat(avgDiscount.toFixed(2)),
      discountRevenue: parseFloat(discountRevenue.toFixed(2))
    };
  }

  calculateChannelTrends(channelSales) {
    const salesByMonth = {};
    
    channelSales.forEach(sale => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!salesByMonth[monthKey]) {
        salesByMonth[monthKey] = {
          month: monthKey,
          revenue: 0,
          orders: 0,
          quantity: 0
        };
      }
      
      salesByMonth[monthKey].revenue += sale.total_value || 0;
      salesByMonth[monthKey].orders += 1;
      salesByMonth[monthKey].quantity += sale.quantity || 0;
    });
    
    return Object.values(salesByMonth).sort((a, b) => a.month.localeCompare(b.month));
  }

  getChannelTopProducts(channelSales, products) {
    const productSales = {};
    
    channelSales.forEach(sale => {
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
      .slice(0, 10);
    
    // Enriquecer con datos del producto
    return topProducts.map(p => {
      const product = products.find(prod => prod.sku_id === p.sku_id);
      return {
        ...p,
        product_name: product?.product_name || 'Unknown',
        category: product?.category || 'Unknown',
        revenue: parseFloat(p.revenue.toFixed(2))
      };
    });
  }

  getChannelCustomerProfile(channelSales, customers) {
    const uniqueCustomers = new Set(
      channelSales
        .filter(s => s.customer_id)
        .map(s => s.customer_id)
    );
    
    const customerIds = Array.from(uniqueCustomers);
    const channelCustomers = customers.filter(c => customerIds.includes(c.cust_id));
    
    // Análisis demográfico
    const genderDistribution = this.groupBy(channelCustomers, 'gender');
    const cityDistribution = this.groupBy(channelCustomers, 'city');
    const loyaltyDistribution = this.groupBy(channelCustomers, 'loyalty_segment');
    
    return {
      totalCustomers: uniqueCustomers.size,
      registeredCustomers: customerIds.length,
      guestCustomers: uniqueCustomers.size - customerIds.length,
      demographics: {
        byGender: genderDistribution,
        byCity: Object.entries(cityDistribution)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
        byLoyalty: loyaltyDistribution
      }
    };
  }

  groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key] || 'Unknown';
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  generateChannelsSummary(result) {
    const channels = Object.keys(result);
    let totalRevenue = 0;
    let totalOrders = 0;
    
    const channelRanking = channels.map(channel => {
      const metrics = result[channel];
      totalRevenue += metrics.totalRevenue;
      totalOrders += metrics.totalOrders;
      
      return {
        channel,
        revenue: metrics.totalRevenue,
        orders: metrics.totalOrders,
        avgTicket: metrics.averageTicket
      };
    }).sort((a, b) => b.revenue - a.revenue);
    
    channelRanking.forEach(ch => {
      ch.revenueShare = parseFloat(((ch.revenue / totalRevenue) * 100).toFixed(2));
      ch.ordersShare = parseFloat(((ch.orders / totalOrders) * 100).toFixed(2));
    });
    
    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalOrders,
      channelRanking,
      topChannel: channelRanking[0].channel,
      channelCount: channels.length
    };
  }
}

export default new ChannelMartService();
