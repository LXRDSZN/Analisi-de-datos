<template>
  <div class="report-view">
    <div class="report-header">
      <h2>📋 Reporte Ejecutivo Semanal</h2>
      <p class="report-date">Período: {{ data.period || 'Últimos 7 días' }}</p>
    </div>

    <div class="summary-section">
      <h3>📊 Resumen Ejecutivo</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Ingresos Totales</div>
          <div class="metric-value">${{ formatNumber(data.sections?.dailySales?.summary?.totalRevenue || 0) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Total Órdenes</div>
          <div class="metric-value">{{ formatNumber(data.sections?.dailySales?.summary?.totalOrders || 0) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Ticket Promedio</div>
          <div class="metric-value">${{ formatNumber(data.sections?.dailySales?.summary?.averageTicket || 0) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Productos Vendidos</div>
          <div class="metric-value">{{ formatNumber(data.sections?.dailySales?.summary?.totalQuantity || 0) }}</div>
        </div>
      </div>
    </div>

    <div class="section" v-if="data.sections?.topProducts?.products?.length">
      <h3>🏆 Top 10 Productos</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Ingresos</th>
            <th>Unidades</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in data.sections.topProducts.products.slice(0, 10)" :key="product.sku_id">
            <td>{{ product.rank }}</td>
            <td>{{ product.product_name || 'N/A' }}</td>
            <td>{{ product.category || 'N/A' }}</td>
            <td>${{ formatNumber(product.revenue || 0) }}</td>
            <td>{{ formatNumber(product.quantity || 0) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section" v-if="data.sections?.storePerformance?.stores?.length">
      <h3>🏪 Rendimiento por Tienda (Top 5)</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tienda</th>
            <th>Ciudad</th>
            <th>Ingresos</th>
            <th>Órdenes</th>
            <th>Ticket Promedio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="store in data.sections.storePerformance.stores.slice(0, 5)" :key="store.store_id">
            <td>{{ store.store_name || 'N/A' }}</td>
            <td>{{ store.city || 'N/A' }}</td>
            <td>${{ formatNumber(store.revenue || 0) }}</td>
            <td>{{ formatNumber(store.orders || 0) }}</td>
            <td>${{ formatNumber(store.avgTicket || store.averageTicket || 0) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section" v-if="data.sections?.channelPerformance?.channels?.length">
      <h3>💰 Ticket Promedio por Canal</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Canal</th>
            <th>Ingresos</th>
            <th>Órdenes</th>
            <th>Ticket Promedio</th>
            <th>% Participación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="channel in data.sections.channelPerformance.channels" :key="channel.channel">
            <td>{{ channel.channel || 'N/A' }}</td>
            <td>${{ formatNumber(channel.totalRevenue || 0) }}</td>
            <td>{{ formatNumber(channel.orders || channel.totalOrders || 0) }}</td>
            <td>${{ formatNumber(channel.avgTicket || channel.averageTicket || 0) }}</td>
            <td>{{ (channel.revenueShare || 0).toFixed(2) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section" v-if="data.sections?.discountAnalysis?.summary">
      <h3>🏷️ Análisis de Descuentos</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Órdenes con Descuento</div>
          <div class="metric-value">{{ (data.sections.discountAnalysis.summary.discountPercentage || 0).toFixed(2) }}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Descuento Promedio</div>
          <div class="metric-value">{{ (data.sections.discountAnalysis.summary.averageDiscount || 0).toFixed(2) }}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Ingresos con Descuento</div>
          <div class="metric-value">${{ formatNumber(data.sections.discountAnalysis.summary.discountRevenue || 0) }}</div>
        </div>
      </div>
    </div>

    <div class="section" v-if="data.sections?.customerRetention?.summary">
      <h3>👥 Retención de Clientes</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Clientes Totales</div>
          <div class="metric-value">{{ formatNumber(data.sections.customerRetention.summary.totalCustomers || 0) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Clientes Recurrentes</div>
          <div class="metric-value">{{ formatNumber(data.sections.customerRetention.summary.recurringCustomers || 0) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Tasa de Recurrencia</div>
          <div class="metric-value">{{ (data.sections.customerRetention.summary.recurringRate || 0).toFixed(2) }}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Clientes Leales (5+ compras)</div>
          <div class="metric-value">{{ formatNumber(data.sections.customerRetention.summary.loyalCustomers || 0) }}</div>
        </div>
      </div>
    </div>

    <div class="report-footer">
      <p>Generado: {{ formatDate(data.generatedAt || new Date().toISOString()) }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num || 0);
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
