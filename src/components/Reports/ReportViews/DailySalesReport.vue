<template>
  <div class="report-view">
    <div class="report-header">
      <h2>📊 Reporte de Ventas Diarias</h2>
      <p class="report-date">Fecha: {{ data.date }}</p>
    </div>

    <div class="summary-section">
      <h3>📈 Resumen General</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Ingresos Totales</div>
          <div class="metric-value">${{ formatNumber(data.summary.totalRevenue) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Total de Órdenes</div>
          <div class="metric-value">{{ formatNumber(data.summary.totalOrders) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Cantidad Total</div>
          <div class="metric-value">{{ formatNumber(data.summary.totalQuantity) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Ticket Promedio</div>
          <div class="metric-value">${{ formatNumber(data.summary.averageTicket) }}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>🛒 Ventas por Canal</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Canal</th>
            <th>Ingresos</th>
            <th>Órdenes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="channel in data.byChannel" :key="channel.channel">
            <td>{{ channel.channel }}</td>
            <td>${{ formatNumber(channel.revenue) }}</td>
            <td>{{ channel.orders }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section" v-if="data.topProducts && data.topProducts.length">
      <h3>🏆 Top Productos del Día</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Ingresos</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in data.topProducts.slice(0, 5)" :key="product.sku_id">
            <td>{{ product.rank }}</td>
            <td>{{ product.product_name }}</td>
            <td>{{ product.category }}</td>
            <td>${{ formatNumber(product.revenue) }}</td>
            <td>{{ product.quantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="report-footer">
      <p>Generado: {{ formatDate(data.generatedAt) }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  data: {
    type: Object,
    required: true
  }
});

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
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

.report-date {
  color: #666;
  font-size: 1.1rem;
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

.report-footer {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 2px solid #e0e0e0;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}
</style>
