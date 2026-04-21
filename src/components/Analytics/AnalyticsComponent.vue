<template>
  <div class="analytics-container">
    <div class="analytics-header">
      <h1 class="page-title">
        <span class="icon">📈</span>
        Análisis de Ventas
      </h1>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando análisis...</p>
    </div>

    <div v-else class="analytics-content">
      <!-- Sales by Channel -->
      <div class="chart-section">
        <h2 class="section-title">📱 Ventas por Canal</h2>
        <div class="chart-card">
          <canvas ref="channelChart"></canvas>
        </div>
      </div>

      <!-- Sales by Store -->
      <div class="chart-section full-width">
        <h2 class="section-title">🏪 Ventas por Tienda</h2>
        <div class="chart-card">
          <canvas ref="storeChart"></canvas>
        </div>
      </div>

      <!-- Sales Summary Table -->
      <div class="table-section">
        <h2 class="section-title">💼 Resumen de Canales</h2>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Canal</th>
                <th>Ventas Totales</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in channelData" :key="item.channel">
                <td class="channel-name">{{ item.channel }}</td>
                <td class="sales-value">${{ formatNumber(item.total) }}</td>
                <td>
                  <div class="percentage-bar">
                    <div class="bar-fill" :style="{ width: getPercentage(item.total) + '%' }"></div>
                    <span class="percentage-text">{{ getPercentage(item.total) }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const loading = ref(true);
const channelData = ref([]);
const storeData = ref([]);
const channelChart = ref(null);
const storeChart = ref(null);

const totalSales = computed(() => {
  return channelData.value.reduce((sum, item) => sum + item.total, 0);
});

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-MX').format(num);
};

const getPercentage = (value) => {
  return totalSales.value > 0 ? ((value / totalSales.value) * 100).toFixed(1) : 0;
};

const loadAnalytics = async () => {
  try {
    const [channelRes, storeRes] = await Promise.all([
      axios.get('http://localhost:5000/api/analytics/sales-by-channel', { withCredentials: true }),
      axios.get('http://localhost:5000/api/analytics/sales-by-store', { withCredentials: true })
    ]);
    
    channelData.value = channelRes.data;
    storeData.value = storeRes.data;
    
    await nextTick();
    createCharts();
    loading.value = false;
  } catch (error) {
    console.error('Error loading analytics:', error);
    loading.value = false;
  }
};

const createCharts = () => {
  if (channelChart.value) {
    const ctx = channelChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: channelData.value.map(d => d.channel),
        datasets: [{
          data: channelData.value.map(d => d.total),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }

  if (storeChart.value) {
    const ctx = storeChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: storeData.value.map(d => d.store.substring(0, 20)),
        datasets: [{
          label: 'Ventas ($)',
          data: storeData.value.map(d => d.total),
          backgroundColor: 'rgba(102, 126, 234, 0.7)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};

onMounted(() => {
  loadAnalytics();
});
</script>

<style scoped>
.analytics-container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.analytics-header {
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

.analytics-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  width: 100%;
}

.chart-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-section.full-width {
  grid-column: 1 / -1;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}

.chart-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 2rem;
  box-sizing: border-box;
}

.chart-card canvas {
  width: 100% !important;
  height: auto !important;
  max-height: 400px;
}

.table-section {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.data-table thead tr {
  border-bottom: 2px solid #e0e0e0;
}

.data-table th {
  padding: 1.25rem;
  text-align: left;
  font-weight: 600;
  font-size: 1rem;
}

.data-table td {
  padding: 1.25rem;
  border-bottom: 1px solid #e0e0e0;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.channel-name {
  font-weight: 600;
}

.sales-value {
  font-weight: 700;
  font-size: 1.1rem;
}

.percentage-bar {
  position: relative;
  width: 100%;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.5s ease;
}

.percentage-text {
  position: relative;
  z-index: 1;
  padding-left: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
}

@media (max-width: 1200px) {
  .analytics-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .chart-card {
    padding: 1.25rem;
  }

  .data-table th,
  .data-table td {
    padding: 1rem 0.75rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
  }

  .chart-card {
    padding: 1rem;
  }
}
</style>
