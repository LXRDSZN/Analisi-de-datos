<template>
  <div class="inventory-container">
    <div class="inventory-header">
      <h1 class="page-title">
        <span class="icon">📋</span>
        Gestión de Inventario
      </h1>
    </div>

    <div class="filter-tabs">
      <button 
        @click="currentView = 'all'" 
        :class="['tab-btn', { active: currentView === 'all' }]"
      >
        📦 Todo el Inventario
      </button>
      <button 
        @click="currentView = 'low'" 
        :class="['tab-btn', { active: currentView === 'low' }]"
      >
        ⚠️ Stock Bajo ({{ lowStockCount }})
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando inventario...</p>
    </div>

    <div v-else class="inventory-content">
      <div class="inventory-stats">
        <p>Mostrando <strong>{{ displayedItems.length }}</strong> productos</p>
      </div>

      <div class="table-container">
        <table class="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Tienda</th>
              <th>Ciudad</th>
              <th>Stock</th>
              <th>Punto Reorden</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedItems" :key="`${item.store_id}-${item.sku_id}`">
              <td class="sku-id">{{ item.sku_id }}</td>
              <td class="product-name">{{ item.product_name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.store_name }}</td>
              <td>{{ item.city }}</td>
              <td :class="['stock-cell', getStockClass(item)]">
                {{ item.stock_on_hand }}
              </td>
              <td>{{ item.reorder_point }}</td>
              <td>
                <span :class="['status-badge', getStatusClass(item)]">
                  {{ getStatusText(item) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const loading = ref(true);
const inventory = ref([]);
const lowStock = ref([]);
const currentView = ref('all');
const currentPage = ref(1);
const itemsPerPage = 20;

const lowStockCount = computed(() => lowStock.value.length);

const displayedItems = computed(() => {
  return currentView.value === 'all' ? inventory.value : lowStock.value;
});

const totalPages = computed(() => {
  return Math.ceil(displayedItems.value.length / itemsPerPage);
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return displayedItems.value.slice(start, end);
});

const getStockClass = (item) => {
  if (item.stock_on_hand === 0) return 'no-stock';
  if (item.needs_restock) return 'low-stock';
  return 'good-stock';
};

const getStatusClass = (item) => {
  if (item.stock_on_hand === 0) return 'status-critical';
  if (item.needs_restock) return 'status-warning';
  return 'status-ok';
};

const getStatusText = (item) => {
  if (item.stock_on_hand === 0) return 'Sin Stock';
  if (item.needs_restock) return 'Reabastecer';
  return 'Disponible';
};

const loadInventory = async () => {
  try {
    const [inventoryRes, lowStockRes] = await Promise.all([
      axios.get('http://localhost:5000/api/inventory', { withCredentials: true }),
      axios.get('http://localhost:5000/api/inventory/low-stock', { withCredentials: true })
    ]);
    
    inventory.value = inventoryRes.data;
    lowStock.value = lowStockRes.data;
    loading.value = false;
  } catch (error) {
    console.error('Error loading inventory:', error);
    loading.value = false;
  }
};

onMounted(() => {
  loadInventory();
});
</script>

<style scoped>
.inventory-container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.inventory-header {
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

.filter-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  border-color: #667eea;
}

.tab-btn.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
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

.inventory-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.inventory-stats {
  font-size: 1rem;
}

.inventory-stats p {
  margin: 0;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-sizing: border-box;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.inventory-table thead tr {
  border-bottom: 2px solid #e0e0e0;
}

.inventory-table th {
  padding: 1.25rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

.inventory-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.9rem;
}

.inventory-table tbody tr:last-child td {
  border-bottom: none;
}

.inventory-table tbody tr:hover {
  background: rgba(0, 0, 0, 0.02);
}

.sku-id {
  font-weight: 600;
  font-family: monospace;
}

.product-name {
  font-weight: 600;
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stock-cell {
  font-weight: 700;
  font-size: 1.1rem;
}

.stock-cell.good-stock {
  color: #4caf50;
}

.stock-cell.low-stock {
  color: #ff9800;
}

.stock-cell.no-stock {
  color: #f44336;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.status-ok {
  border: 1px solid #4caf50;
  color: #4caf50;
}

.status-badge.status-warning {
  border: 1px solid #ff9800;
  color: #ff9800;
}

.status-badge.status-critical {
  border: 1px solid #f44336;
  color: #f44336;
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

  .filter-tabs {
    gap: 0.75rem;
  }

  .tab-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  .inventory-table th,
  .inventory-table td {
    padding: 0.85rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
  }

  .filter-tabs {
    flex-direction: column;
  }

  .tab-btn {
    width: 100%;
  }
}
</style>
