<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">
        <n-icon size="32" class="title-icon">
          <StatsChartOutline />
        </n-icon>
        Dashboard de Análisis
      </h1>
      <p class="dashboard-subtitle">BlueMart Analytics System</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando datos...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- KPIs Cards -->
      <div class="kpi-grid">
        <div class="kpi-card sales">
          <div class="kpi-icon">💰</div>
          <div class="kpi-info">
            <h3>Ventas Totales</h3>
            <p class="kpi-value">${{ formatNumber(dashboardData.kpis?.totalSales || 0) }}</p>
          </div>
        </div>

        <div class="kpi-card products">
          <div class="kpi-icon">📦</div>
          <div class="kpi-info">
            <h3>Productos Vendidos</h3>
            <p class="kpi-value">{{ formatNumber(dashboardData.kpis?.totalQuantity || 0) }}</p>
          </div>
        </div>

        <div class="kpi-card customers">
          <div class="kpi-icon">👥</div>
          <div class="kpi-info">
            <h3>Clientes</h3>
            <p class="kpi-value">{{ dashboardData.kpis?.totalCustomers || 0 }}</p>
          </div>
        </div>

        <div class="kpi-card ticket">
          <div class="kpi-icon">🎫</div>
          <div class="kpi-info">
            <h3>Ticket Promedio</h3>
            <p class="kpi-value">${{ formatNumber(dashboardData.kpis?.averageTicket || 0) }}</p>
          </div>
        </div>

        <div class="kpi-card inventory">
          <div class="kpi-icon">📋</div>
          <div class="kpi-info">
            <h3>Total Productos</h3>
            <p class="kpi-value">{{ dashboardData.kpis?.totalProducts || 0 }}</p>
          </div>
        </div>

        <div class="kpi-card alert">
          <div class="kpi-icon">⚠️</div>
          <div class="kpi-info">
            <h3>Stock Bajo</h3>
            <p class="kpi-value">{{ dashboardData.kpis?.lowStockCount || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <div class="chart-card">
          <h3 class="chart-title">
            <n-icon size="24" class="chart-icon">
              <TrendingUpOutline />
            </n-icon>
            Ventas Mensuales
          </h3>
          <canvas ref="salesChart"></canvas>
        </div>

        <div class="chart-card">
          <h3 class="chart-title">
            <n-icon size="24" class="chart-icon">
              <PieChartOutline />
            </n-icon>
            Top Categorías
          </h3>
          <canvas ref="categoriesChart"></canvas>
        </div>

        <div class="chart-card full-width">
          <h3 class="chart-title">
            <n-icon size="24" class="chart-icon">
              <BarChartOutline />
            </n-icon>
            Productos Más Vendidos
          </h3>
          <canvas ref="productsChart"></canvas>
        </div>
      </div>

      <!-- Low Stock Alert Table -->
      <div v-if="dashboardData.charts?.lowStockItems?.length > 0" class="low-stock-section">
        <h3 class="section-title">
          <n-icon size="24" class="section-icon">
            <WarningOutline />
          </n-icon>
          Productos con Stock Bajo
        </h3>
        <div class="table-responsive">
          <table class="stock-table">
            <thead>
              <tr>
                <th>SKU ID</th>
                <th>Tienda</th>
                <th>Stock Actual</th>
                <th>Punto de Reorden</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in dashboardData.charts.lowStockItems" :key="`${item.store_id}-${item.sku_id}`">
                <td>{{ item.sku_id }}</td>
                <td>Tienda {{ item.store_id }}</td>
                <td class="stock-value">{{ item.stock_on_hand }}</td>
                <td>{{ item.reorder_point }}</td>
                <td><span class="badge-alert">Crítico</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { NIcon } from 'naive-ui';
import {
  StatsChartOutline,
  TrendingUpOutline,
  PieChartOutline,
  BarChartOutline,
  WarningOutline
} from '@vicons/ionicons5';

Chart.register(...registerables);

const loading = ref(true);
const dashboardData = ref({});
const salesChart = ref(null);
const categoriesChart = ref(null);
const productsChart = ref(null);

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-MX').format(num);
};

const loadDashboard = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/analytics/dashboard', {
      withCredentials: true
    });
    dashboardData.value = response.data;
    
    await nextTick();
    createCharts();
    loading.value = false;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    loading.value = false;
  }
};

const createCharts = () => {
  if (salesChart.value) {
    const ctx = salesChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dashboardData.value.charts.salesByMonth.map(d => d.month),
        datasets: [{
          label: 'Ventas ($)',
          data: dashboardData.value.charts.salesByMonth.map(d => d.total),
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { 
            display: true,
            labels: { color: '#8b9dc3' }
          }
        },
        scales: {
          y: {
            ticks: { color: '#8b9dc3' },
            grid: { color: 'rgba(139, 157, 195, 0.1)' }
          },
          x: {
            ticks: { color: '#8b9dc3' },
            grid: { color: 'rgba(139, 157, 195, 0.1)' }
          }
        }
      }
    });
  }

  if (categoriesChart.value) {
    const ctx = categoriesChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: dashboardData.value.charts.topCategories.map(d => d.category),
        datasets: [{
          data: dashboardData.value.charts.topCategories.map(d => d.total),
          backgroundColor: [
            '#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
            '#ffeaa7', '#dfe6e9', '#74b9ff', '#a29bfe', '#fd79a8'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: '#8b9dc3' }
          }
        }
      }
    });
  }

  if (productsChart.value) {
    const ctx = productsChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dashboardData.value.charts.topProducts.map(d => d.product.substring(0, 30)),
        datasets: [{
          label: 'Ventas ($)',
          data: dashboardData.value.charts.topProducts.map(d => d.total),
          backgroundColor: 'rgba(0, 212, 255, 0.7)',
          borderColor: '#00d4ff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { 
            display: false
          }
        },
        scales: {
          y: {
            ticks: { color: '#8b9dc3' },
            grid: { color: 'rgba(139, 157, 195, 0.1)' }
          },
          x: {
            ticks: { color: '#8b9dc3' },
            grid: { color: 'rgba(139, 157, 195, 0.1)' }
          }
        }
      }
    });
  }
};

onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.7;
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

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-sizing: border-box;
}

.kpi-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.kpi-info {
  flex: 1;
  min-width: 0;
}

.kpi-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kpi-value {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.chart-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.chart-card canvas {
  width: 100% !important;
  height: auto !important;
  max-height: 350px;
}

/* Low Stock Section */
.low-stock-section {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  box-sizing: border-box;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.stock-table thead tr {
  border-bottom: 2px solid #e0e0e0;
}

.stock-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.stock-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.stock-table tbody tr:last-child td {
  border-bottom: none;
}

.badge-alert {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #ff4444;
}

/* Responsive */
@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1.5rem;
  }

  .dashboard-subtitle {
    font-size: 1rem;
  }

  .kpi-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .kpi-card {
    padding: 1rem;
    gap: 1rem;
  }

  .kpi-icon {
    font-size: 2rem;
  }

  .kpi-value {
    font-size: 1.4rem;
  }

  .charts-grid {
    gap: 1rem;
  }

  .chart-card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-title {
    font-size: 1.25rem;
  }

  .kpi-card {
    flex-direction: column;
    text-align: center;
  }

  .stock-table th,
  .stock-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
  }
}
</style>


