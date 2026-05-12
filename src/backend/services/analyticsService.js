import csvService from '../services/csvService.js';

class AnalyticsService {
  
  async getDashboardStats() {
    const [sales, products, inventory, customers, stores] = await Promise.all([
      csvService.getSales(),
      csvService.getProducts(),
      csvService.getInventory(),
      csvService.getCustomers(),
      csvService.getStores()
    ]);

    const totalSales = sales.reduce((sum, sale) => sum + (sale.total_value || 0), 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
    const totalCustomers = customers.length;
    const totalProducts = products.length;

    const averageTicket = sales.length > 0 ? totalSales / sales.length : 0;

    const lowStockItems = inventory.filter(item => item.stock_on_hand < item.reorder_point);

    // Gráficas existentes
    const salesByMonth = this.groupSalesByMonth(sales);
    const topCategories = this.getTopCategories(sales, products);
    const topProducts = this.getTopProducts(sales, products);

    // NUEVAS GRÁFICAS - Clientes
    const customersByGender = this.groupCustomersByGender(customers);
    const customersByLoyalty = this.groupCustomersByLoyalty(customers);
    const customersByCity = this.groupCustomersByCity(customers);

    // NUEVAS GRÁFICAS - Ventas
    const salesByChannel = this.calculateSalesByChannel(sales);
    const salesByDay = this.groupSalesByDay(sales);
    const salesByCustomerType = this.calculateSalesByCustomerType(sales);

    // KPIs Extras
    const topChannel = this.getTopChannel(sales);
    const topCategory = topCategories[0]?.category || 'N/A';

    // Insights
    const insights = this.generateInsights(sales, products, salesByChannel, topCategories);

    return {
      kpis: {
        totalSales: parseFloat(totalSales.toFixed(2)),
        totalQuantity,
        totalCustomers,
        totalProducts,
        averageTicket: parseFloat(averageTicket.toFixed(2)),
        lowStockCount: lowStockItems.length,
        totalOrders: sales.length,
        totalStores: stores.length,
        totalInventoryItems: inventory.length,
        topChannel: topChannel,
        topCategory: topCategory
      },
      charts: {
        // Existentes
        salesByMonth,
        topCategories,
        topProducts,
        
        // Nuevas - Clientes
        customersByGender,
        customersByLoyalty,
        customersByCity,
        
        // Nuevas - Ventas
        salesByChannel,
        salesByDay,
        salesByCustomerType,
        
        lowStockItems: lowStockItems.slice(0, 10)
      },
      insights
    };
  }

  groupSalesByMonth(sales) {
    const grouped = {};
    
    sales.forEach(sale => {
      if (!sale.date) return;
      
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = { total: 0, quantity: 0 };
      }
      
      grouped[monthKey].total += sale.total_value || 0;
      grouped[monthKey].quantity += sale.quantity || 0;
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, data]) => ({
        month,
        total: parseFloat(data.total.toFixed(2)),
        quantity: data.quantity
      }));
  }

  getTopCategories(sales, products) {
    const categoryMap = {};
    
    products.forEach(product => {
      categoryMap[product.sku_id] = product.category;
    });

    const categorySales = {};
    
    sales.forEach(sale => {
      const category = categoryMap[sale.sku_id] || 'Unknown';
      
      if (!categorySales[category]) {
        categorySales[category] = 0;
      }
      
      categorySales[category] += sale.total_value || 0;
    });

    return Object.entries(categorySales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([category, total]) => ({
        category,
        total: parseFloat(total.toFixed(2))
      }));
  }

  getTopProducts(sales, products) {
    const productMap = {};
    
    products.forEach(product => {
      productMap[product.sku_id] = product.sku_name;
    });

    const productSales = {};
    
    sales.forEach(sale => {
      const productName = productMap[sale.sku_id] || `SKU ${sale.sku_id}`;
      
      if (!productSales[productName]) {
        productSales[productName] = { total: 0, quantity: 0 };
      }
      
      productSales[productName].total += sale.total_value || 0;
      productSales[productName].quantity += sale.quantity || 0;
    });

    return Object.entries(productSales)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 10)
      .map(([product, data]) => ({
        product,
        total: parseFloat(data.total.toFixed(2)),
        quantity: data.quantity
      }));
  }

  async getSalesByChannel() {
    const sales = await csvService.getSales();
    
    const channelSales = {};
    
    sales.forEach(sale => {
      const channel = sale.channel || 'Desconocido';
      
      if (!channelSales[channel]) {
        channelSales[channel] = 0;
      }
      
      channelSales[channel] += sale.total_value || 0;
    });

    return Object.entries(channelSales)
      .sort(([, a], [, b]) => b - a)
      .map(([channel, total]) => ({
        channel,
        total: parseFloat(total.toFixed(2))
      }));
  }

  async getSalesByStore() {
    const [sales, stores] = await Promise.all([
      csvService.getSales(),
      csvService.getStores()
    ]);

    const storeMap = {};
    stores.forEach(store => {
      storeMap[store.store_id] = store.store_name;
    });

    const storeSales = {};
    
    sales.forEach(sale => {
      const storeName = storeMap[sale.store_id] || `Store ${sale.store_id}`;
      
      if (!storeSales[storeName]) {
        storeSales[storeName] = 0;
      }
      
      storeSales[storeName] += sale.total_value || 0;
    });

    return Object.entries(storeSales)
      .sort(([, a], [, b]) => b - a)
      .map(([store, total]) => ({
        store,
        total: parseFloat(total.toFixed(2))
      }));
  }

  async getDetailedStats() {
    const [sales, products, inventory, customers, stores, promotions] = await Promise.all([
      csvService.getSales(),
      csvService.getProducts(),
      csvService.getInventory(),
      csvService.getCustomers(),
      csvService.getStores(),
      csvService.getPromotions()
    ]);

    // Análisis de clientes
    const customersByGender = this.groupBy(customers, 'gender');
    const customersByCity = this.groupBy(customers, 'city');
    const customersByLoyalty = this.groupBy(customers, 'loyalty_segment');

    // Análisis de ventas por canal
    const salesByChannel = this.aggregateSales(sales, 'channel');
    
    // Análisis de descuentos
    const avgDiscount = sales.reduce((sum, s) => sum + (s.discount_pct || 0), 0) / sales.length;
    
    // Análisis de inventario
    const totalStock = inventory.reduce((sum, i) => sum + (i.stock_on_hand || 0), 0);
    const lowStock = inventory.filter(i => i.stock_on_hand < i.reorder_point).length;

    return {
      totalRecords: {
        sales: sales.length,
        customers: customers.length,
        products: products.length,
        stores: stores.length,
        inventoryItems: inventory.length,
        promotions: promotions.length
      },
      customers: {
        total: customers.length,
        byGender: customersByGender,
        byCity: customersByCity.slice(0, 10),
        byLoyalty: customersByLoyalty
      },
      sales: {
        total: sales.reduce((sum, s) => sum + (s.total_value || 0), 0),
        avgDiscount: parseFloat(avgDiscount.toFixed(2)),
        byChannel: salesByChannel
      },
      inventory: {
        totalStock,
        lowStockCount: lowStock,
        totalItems: inventory.length
      },
      stores: {
        total: stores.length,
        byCity: this.groupBy(stores, 'city')
      }
    };
  }

  groupBy(array, key) {
    const grouped = {};
    array.forEach(item => {
      const value = item[key] || 'Unknown';
      grouped[value] = (grouped[value] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));
  }

  aggregateSales(sales, key) {
    const grouped = {};
    sales.forEach(sale => {
      const value = sale[key] || 'Unknown';
      if (!grouped[value]) {
        grouped[value] = { total: 0, quantity: 0, orders: 0 };
      }
      grouped[value].total += sale.total_value || 0;
      grouped[value].quantity += sale.quantity || 0;
      grouped[value].orders += 1;
    });
    return Object.entries(grouped)
      .sort(([, a], [, b]) => b.total - a.total)
      .map(([name, data]) => ({
        name,
        total: parseFloat(data.total.toFixed(2)),
        quantity: data.quantity,
        orders: data.orders
      }));
  }

  // ============================================
  // NUEVOS MÉTODOS PARA DASHBOARD MEJORADO
  // ============================================

  // Clientes por Género
  groupCustomersByGender(customers) {
    const grouped = {};
    customers.forEach(customer => {
      let gender = customer.gender || 'Desconocido';
      // Traducir a español
      if (gender === 'Male') gender = 'Hombre';
      else if (gender === 'Female') gender = 'Mujer';
      
      grouped[gender] = (grouped[gender] || 0) + 1;
    });
    
    return Object.entries(grouped).map(([gender, count]) => ({
      gender,
      count,
      percentage: parseFloat(((count / customers.length) * 100).toFixed(1))
    }));
  }

  // Clientes por Nivel de Lealtad
  groupCustomersByLoyalty(customers) {
    const grouped = {};
    customers.forEach(customer => {
      let loyalty = customer.loyalty_segment || 'Desconocido';
      // Traducir a español si es necesario
      if (loyalty === 'Silver') loyalty = 'Plata';
      else if (loyalty === 'Gold') loyalty = 'Oro';
      else if (loyalty === 'Platinum') loyalty = 'Platino';
      
      grouped[loyalty] = (grouped[loyalty] || 0) + 1;
    });
    
    return Object.entries(grouped)
      .sort(([, a], [, b]) => b - a)
      .map(([loyalty, count]) => ({
        loyalty,
        count,
        percentage: parseFloat(((count / customers.length) * 100).toFixed(1))
      }));
  }

  // Clientes por Ciudad
  groupCustomersByCity(customers) {
    const grouped = {};
    customers.forEach(customer => {
      const city = customer.city || 'Desconocido';
      grouped[city] = (grouped[city] || 0) + 1;
    });
    
    return Object.entries(grouped)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([city, count]) => ({
        city,
        count,
        percentage: parseFloat(((count / customers.length) * 100).toFixed(1))
      }));
  }

  // Ventas por Canal con porcentajes (método interno)
  calculateSalesByChannel(sales) {
    const channelSales = {};
    const totalSales = sales.reduce((sum, sale) => sum + (sale.total_value || 0), 0);
    
    sales.forEach(sale => {
      const channel = sale.channel || 'Desconocido';
      if (!channelSales[channel]) {
        channelSales[channel] = { total: 0, orders: 0 };
      }
      channelSales[channel].total += sale.total_value || 0;
      channelSales[channel].orders += 1;
    });

    return Object.entries(channelSales)
      .sort(([, a], [, b]) => b.total - a.total)
      .map(([channel, data]) => ({
        channel,
        total: parseFloat(data.total.toFixed(2)),
        orders: data.orders,
        percentage: parseFloat(((data.total / totalSales) * 100).toFixed(1))
      }));
  }

  // Ventas por Día (últimos 30 días)
  groupSalesByDay(sales) {
    const grouped = {};
    
    sales.forEach(sale => {
      if (!sale.date) return;
      
      const dateKey = sale.date.split('T')[0]; // YYYY-MM-DD
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = { total: 0, quantity: 0, orders: 0 };
      }
      
      grouped[dateKey].total += sale.total_value || 0;
      grouped[dateKey].quantity += sale.quantity || 0;
      grouped[dateKey].orders += 1;
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30) // Últimos 30 días
      .map(([date, data]) => ({
        date,
        total: parseFloat(data.total.toFixed(2)),
        quantity: data.quantity,
        orders: data.orders
      }));
  }

  // Top Channel
  getTopChannel(sales) {
    const channelSales = {};
    
    sales.forEach(sale => {
      const channel = sale.channel || 'Unknown';
      channelSales[channel] = (channelSales[channel] || 0) + (sale.total_value || 0);
    });

    const sorted = Object.entries(channelSales).sort(([, a], [, b]) => b - a);
    return sorted[0] ? sorted[0][0] : 'N/A';
  }

  // Insights automáticos
  generateInsights(sales, products, salesByChannel, topCategories) {
    const insights = [];
    const totalSales = sales.reduce((sum, sale) => sum + (sale.total_value || 0), 0);

    // Insight 1: Canal más fuerte
    if (salesByChannel.length > 0) {
      const top = salesByChannel[0];
      insights.push({
        icon: '🏪',
        text: `${top.channel} genera más ventas con $${top.total.toLocaleString('es-MX')} (${top.percentage}%)`
      });
    }

    // Insight 2: Categoría dominante
    if (topCategories.length > 0) {
      const topCat = topCategories[0];
      const percentage = ((topCat.total / totalSales) * 100).toFixed(1);
      insights.push({
        icon: '🏷️',
        text: `${topCat.category} domina con ${percentage}% de las ventas totales`
      });
    }

    // Insight 3: Volumen de órdenes
    insights.push({
      icon: '📦',
      text: `${sales.length.toLocaleString('es-MX')} órdenes procesadas en total`
    });

    return insights;
  }

  calculateSalesByCustomerType(sales) {
    const registered = sales.filter(s => s.customer_id && s.customer_id !== 'null' && s.customer_id !== '');
    const nonRegistered = sales.filter(s => !s.customer_id || s.customer_id === 'null' || s.customer_id === '');

    const registeredSales = registered.reduce((sum, s) => sum + (s.total_value || 0), 0);
    const nonRegisteredSales = nonRegistered.reduce((sum, s) => sum + (s.total_value || 0), 0);

    const registeredQty = registered.reduce((sum, s) => sum + (s.quantity || 0), 0);
    const nonRegisteredQty = nonRegistered.reduce((sum, s) => sum + (s.quantity || 0), 0);

    const totalOrders = sales.length;
    const registeredOrders = registered.length;
    const nonRegisteredOrders = nonRegistered.length;

    const result = {
      registered: {
        orders: registeredOrders,
        percentage: ((registeredOrders / totalOrders) * 100).toFixed(1),
        totalSales: registeredSales.toFixed(2),
        productsCount: registeredQty,
        averageTicket: registeredOrders > 0 ? (registeredSales / registeredOrders).toFixed(2) : 0
      },
      nonRegistered: {
        orders: nonRegisteredOrders,
        percentage: ((nonRegisteredOrders / totalOrders) * 100).toFixed(1),
        totalSales: nonRegisteredSales.toFixed(2),
        productsCount: nonRegisteredQty,
        averageTicket: nonRegisteredOrders > 0 ? (nonRegisteredSales / nonRegisteredOrders).toFixed(2) : 0
      }
    };

    console.log('📊 Sales by customer type calculated:', result);
    return result;
  }
}

export default new AnalyticsService();
