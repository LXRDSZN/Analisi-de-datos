import csvService from '../services/csvService.js';

export const getInventory = async (req, res) => {
  try {
    const inventory = await csvService.getInventory();
    const products = await csvService.getProducts();
    const stores = await csvService.getStores();

    const productMap = {};
    products.forEach(p => {
      productMap[p.sku_id] = p;
    });

    const storeMap = {};
    stores.forEach(s => {
      storeMap[s.store_id] = s;
    });

    const enrichedInventory = inventory.map(item => ({
      ...item,
      product_name: productMap[item.sku_id]?.sku_name || 'Unknown',
      category: productMap[item.sku_id]?.category || 'Unknown',
      store_name: storeMap[item.store_id]?.store_name || `Store ${item.store_id}`,
      city: storeMap[item.store_id]?.city || 'Unknown',
      needs_restock: item.stock_on_hand < item.reorder_point
    }));

    res.json(enrichedInventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener inventario', error: error.message });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const inventory = await csvService.getInventory();
    const products = await csvService.getProducts();

    const productMap = {};
    products.forEach(p => {
      productMap[p.sku_id] = p;
    });

    const lowStock = inventory
      .filter(item => item.stock_on_hand < item.reorder_point)
      .map(item => ({
        ...item,
        product_name: productMap[item.sku_id]?.sku_name || 'Unknown',
        category: productMap[item.sku_id]?.category || 'Unknown'
      }))
      .sort((a, b) => a.stock_on_hand - b.stock_on_hand);

    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener stock bajo', error: error.message });
  }
};
