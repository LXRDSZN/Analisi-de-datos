import csvService from '../services/csvService.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await csvService.getProducts();
    const inventory = await csvService.getInventory();

    const inventoryMap = {};
    inventory.forEach(item => {
      if (!inventoryMap[item.sku_id]) {
        inventoryMap[item.sku_id] = 0;
      }
      inventoryMap[item.sku_id] += item.stock_on_hand || 0;
    });

    const productsWithStock = products.map(product => ({
      ...product,
      total_stock: inventoryMap[product.sku_id] || 0
    }));

    res.json(productsWithStock);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await csvService.getProducts();
    
    const product = products.find(p => p.sku_id === parseInt(id));
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};

export const filterProducts = async (req, res) => {
  try {
    const { category, subcategory, brand, minPrice, maxPrice, search } = req.query;
    
    let products = await csvService.getProducts();

    if (category) {
      products = products.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (subcategory) {
      products = products.filter(p => p.subcategory?.toLowerCase() === subcategory.toLowerCase());
    }

    if (brand) {
      products = products.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
    }

    if (minPrice) {
      products = products.filter(p => p.unit_price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.unit_price <= parseFloat(maxPrice));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.sku_name?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower)
      );
    }

    const inventory = await csvService.getInventory();
    const inventoryMap = {};
    inventory.forEach(item => {
      if (!inventoryMap[item.sku_id]) {
        inventoryMap[item.sku_id] = 0;
      }
      inventoryMap[item.sku_id] += item.stock_on_hand || 0;
    });

    const productsWithStock = products.map(product => ({
      ...product,
      total_stock: inventoryMap[product.sku_id] || 0
    }));

    res.json(productsWithStock);
  } catch (error) {
    res.status(500).json({ message: 'Error al filtrar productos', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const products = await csvService.getProducts();
    
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const subcategories = [...new Set(products.map(p => p.subcategory).filter(Boolean))];
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

    res.json({
      categories: categories.sort(),
      subcategories: subcategories.sort(),
      brands: brands.sort()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};
