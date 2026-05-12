<template>
  <div class="report-view">
    <div class="report-header">
      <h2>🏷️ Análisis de Ventas con Descuento</h2>
    </div>

    <div class="summary-section">
      <h3>📊 Resumen General</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Órdenes Totales</div>
          <div class="metric-value">{{ formatNumber(data.summary.totalOrders) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Con Descuento</div>
          <div class="metric-value">{{ formatNumber(data.summary.ordersWithDiscount) }}</div>
          <div class="metric-sublabel">{{ data.summary.discountPercentage }}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Sin Descuento</div>
          <div class="metric-value">{{ formatNumber(data.summary.ordersWithoutDiscount) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Descuento Promedio</div>
          <div class="metric-value">{{ data.summary.averageDiscount }}%</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>💰 Impacto en Ingresos</h3>
      <div class="revenue-grid">
        <div class="revenue-card">
          <div class="revenue-label">Ingresos Totales</div>
          <div class="revenue-value">${{ formatNumber(data.summary.totalRevenue) }}</div>
        </div>
        <div class="revenue-card highlight">
          <div class="revenue-label">Ingresos con Descuento</div>
          <div class="revenue-value">${{ formatNumber(data.summary.discountRevenue) }}</div>
          <div class="revenue-percentage">{{ data.summary.discountRevenueShare }}% del total</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>📈 Distribución por Rango de Descuento</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Rango de Descuento</th>
            <th>Cantidad de Órdenes</th>
            <th>Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(count, range) in data.discountRanges" :key="range">
            <td><strong>{{ range }}</strong></td>
            <td>{{ formatNumber(count) }}</td>
            <td>
              <div class="percentage-bar">
                <div class="percentage-fill" :style="{ width: calculatePercentage(count) + '%' }"></div>
                <span class="percentage-text">{{ calculatePercentage(count) }}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h3>🎯 Insights</h3>
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon">📊</div>
          <div class="insight-content">
            <h4>Tasa de Descuento</h4>
            <p>{{ data.summary.discountPercentage }}% de las ventas utilizan promociones</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">💸</div>
          <div class="insight-content">
            <h4>Descuento Promedio</h4>
            <p>En promedio, se aplica un {{ data.summary.averageDiscount }}% de descuento</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">💰</div>
          <div class="insight-content">
            <h4>Impacto en Ingresos</h4>
            <p>{{ data.summary.discountRevenueShare }}% de los ingresos provienen de ventas con descuento</p>
          </div>
        </div>
      </div>
    </div>

    <div class="report-footer">
      <p>Generado: {{ formatDate(data.generatedAt) }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const totalDiscountOrders = computed(() => {
  return Object.values(props.data.discountRanges).reduce((sum, val) => sum + val, 0);
});

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num || 0);
};

const calculatePercentage = (count) => {
  if (totalDiscountOrders.value === 0) return 0;
  return ((count / totalDiscountOrders.value) * 100).toFixed(1);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.report-view {
  background: white;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
}

.report-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #667eea;
}

.report-header h2 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.summary-section {
  margin-bottom: 2rem;
}

.section {
  margin-bottom: 2rem;
}

.section h3, .summary-section h3 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.metric-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  color: white;
}

.metric-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: bold;
}

.metric-sublabel {
  font-size: 1rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

.revenue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.revenue-card {
  padding: 2rem;
  background: #f5f7fa;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #e0e0e0;
}

.revenue-card.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.revenue-label {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.revenue-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.revenue-percentage {
  font-size: 0.9rem;
  opacity: 0.8;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.data-table thead {
  background: #667eea;
  color: white;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.data-table td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.data-table tbody tr:hover {
  background: #f5f7fa;
}

.percentage-bar {
  position: relative;
  background: #e0e0e0;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  min-width: 150px;
}

.percentage-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.percentage-text {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f5f7fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.insight-icon {
  font-size: 2.5rem;
}

.insight-content h4 {
  color: #667eea;
  margin-bottom: 0.5rem;
}

.insight-content p {
  color: #666;
  line-height: 1.5;
}

.report-footer {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 2px solid #e0e0e0;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}
</style>
