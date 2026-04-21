<template>
  <div class="products-container">
    <div class="products-header">
      <h1 class="page-title">
        <span class="icon">📦</span>
        Catálogo de Productos
      </h1>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-group">
        <label>🔍 Buscar</label>
        <input 
          v-model="filters.search" 
          type="text" 
          placeholder="Buscar por nombre o categoría..."
          @input="applyFilters"
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <label>🏷️ Categoría</label>
        <select v-model="filters.category" @change="applyFilters" class="filter-select">
          <option value="">Todas</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label>📂 Subcategoría</label>
        <select v-model="filters.subcategory" @change="applyFilters" class="filter-select">
          <option value="">Todas</option>
          <option v-for="sub in subcategories" :key="sub" :value="sub">{{ sub }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label>🏭 Marca</label>
        <select v-model="filters.brand" @change="applyFilters" class="filter-select">
          <option value="">Todas</option>
          <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label>💰 Precio Mínimo</label>
        <input 
          v-model.number="filters.minPrice" 
          type="number" 
          min="0"
          placeholder="0"
          @input="applyFilters"
          class="filter-input"
        />
      </div>

      <div class="filter-group">
        <label>💵 Precio Máximo</label>
        <input 
          v-model.number="filters.maxPrice" 
          type="number" 
          min="0"
          placeholder="1000"
          @input="applyFilters"
          class="filter-input"
        />
      </div>

      <button @click="clearFilters" class="btn-clear">
        🗑️ Limpiar Filtros
      </button>
    </div>

    <!-- Products Stats -->
    <div class="products-stats">
      <p>Mostrando <strong>{{ filteredProducts.length }}</strong> productos</p>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando productos...</p>
    </div>

    <div v-else class="products-grid">
      <div 
        v-for="product in paginatedProducts" 
        :key="product.sku_id" 
        class="product-card"
      >
        <div class="product-header">
          <span class="product-id">SKU: {{ product.sku_id }}</span>
          <span class="stock-badge" :class="getStockClass(product.total_stock)">
            {{ product.total_stock || 0 }} en stock
          </span>
        </div>
        
        <h3 class="product-name">{{ product.sku_name }}</h3>
        
        <div class="product-details">
          <p><strong>Categoría:</strong> {{ product.category }}</p>
          <p><strong>Subcategoría:</strong> {{ product.subcategory }}</p>
          <p><strong>Marca:</strong> {{ product.brand }}</p>
        </div>
        
        <div class="product-footer">
          <div class="price-section">
            <span class="price">${{ product.unit_price?.toFixed(2) }}</span>
            <span class="cost">Costo: ${{ product.cost_price?.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        ◀ Anterior
      </button>
      
      <span class="page-info">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        Siguiente ▶
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const loading = ref(true);
const products = ref([]);
const filteredProducts = ref([]);
const categories = ref([]);
const subcategories = ref([]);
const brands = ref([]);

const currentPage = ref(1);
const itemsPerPage = 12;

const filters = ref({
  search: '',
  category: '',
  subcategory: '',
  brand: '',
  minPrice: null,
  maxPrice: null
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const getStockClass = (stock) => {
  if (stock === 0) return 'no-stock';
  if (stock < 100) return 'low-stock';
  return 'in-stock';
};

const loadProducts = async () => {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get('http://localhost:5000/api/products', { withCredentials: true }),
      axios.get('http://localhost:5000/api/products/categories', { withCredentials: true })
    ]);
    
    products.value = productsRes.data;
    filteredProducts.value = productsRes.data;
    
    categories.value = categoriesRes.data.categories;
    subcategories.value = categoriesRes.data.subcategories;
    brands.value = categoriesRes.data.brands;
    
    loading.value = false;
  } catch (error) {
    console.error('Error loading products:', error);
    loading.value = false;
  }
};

const applyFilters = async () => {
  currentPage.value = 1;
  
  const params = {};
  
  if (filters.value.search) params.search = filters.value.search;
  if (filters.value.category) params.category = filters.value.category;
  if (filters.value.subcategory) params.subcategory = filters.value.subcategory;
  if (filters.value.brand) params.brand = filters.value.brand;
  if (filters.value.minPrice) params.minPrice = filters.value.minPrice;
  if (filters.value.maxPrice) params.maxPrice = filters.value.maxPrice;
  
  try {
    const response = await axios.get('http://localhost:5000/api/products/filter', {
      params,
      withCredentials: true
    });
    
    filteredProducts.value = response.data;
  } catch (error) {
    console.error('Error filtering products:', error);
  }
};

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    subcategory: '',
    brand: '',
    minPrice: null,
    maxPrice: null
  };
  filteredProducts.value = products.value;
  currentPage.value = 1;
};

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.products-container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.products-header {
  margin-bottom: 2rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.icon {
  font-size: 2.5rem;
}

.filters-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-sizing: border-box;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 600;
}

.filter-input,
.filter-select {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  width: 100%;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.btn-clear {
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
}

.btn-clear:hover {
  border-color: #ff4444;
}

.products-stats {
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.products-stats p {
  margin: 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.product-id {
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.7;
}

.stock-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #e0e0e0;
}

.stock-badge.in-stock {
  border-color: #4caf50;
}

.stock-badge.low-stock {
  border-color: #ff9800;
}

.stock-badge.no-stock {
  border-color: #f44336;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.4;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-details p {
  margin: 0;
  font-size: 0.9rem;
}

.product-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
}

.cost {
  font-size: 0.85rem;
  opacity: 0.7;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}

.pagination-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  border-color: #667eea;
}

.page-info {
  font-weight: 600;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .filters-section {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .product-card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
