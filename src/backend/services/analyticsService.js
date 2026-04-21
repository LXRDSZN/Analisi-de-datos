import csvService from '../services/csvService.js';

class AnalyticsService {
  
  async getDashboardStats() {
    const [sales, products, inventory, customers] = await Promise.all([
      csvService.getSales(),
      csvService.getProducts(),
      csvService.getInventory(),
      csvService.getCustomers()
    ]);

    const totalSales = sales.reduce((sum, sale) => sum + (sale.total_value || 0), 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
    const totalCustomers = customers.length;
    const totalProducts = products.length;

    const averageTicket = sales.length > 0 ? totalSales / sales.length : 0;

    const lowStockItems = inventory.filter(item => item.stock_on_hand < item.reorder_point);

    const salesByMonth = this.groupSalesByMonth(sales);
    const topCategories = this.getTopCategories(sales, products);
    const topProducts = this.getTopProducts(sales, products);

    return {
      kpis: {
        totalSales: parseFloat(totalSales.toFixed(2)),
        totalQuantity,
        totalCustomers,
        totalProducts,
        averageTicket: parseFloat(averageTicket.toFixed(2)),
        lowStockCount: lowStockItems.length,
        totalOrders: sales.length,
        totalStores: (await csvService.getStores()).length,
        totalInventoryItems: inventory.length
      },
      charts: {
        salesByMonth,
        topCategories,
        topProducts,
        lowStockItems: lowStockItems.slice(0, 10)
      }
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
      const channel = sale.channel || 'Unknown';
      
      if (!channelSales[channel]) {
        channelSales[channel] = 0;
      }
      
      channelSales[channel] += sale.total_value || 0;
    });

    return Object.entries(channelSales).map(([channel, total]) => ({
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
}

export default new AnalyticsService();
