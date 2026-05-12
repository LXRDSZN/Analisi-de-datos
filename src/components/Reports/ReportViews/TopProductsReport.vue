<template>
  <div class="report-view">
    <div class="report-header">
      <h2>🏆 Top {{ data.totalProducts || 10 }} Productos</h2>
      <p class="report-date">Período: {{ getPeriodLabel(data.period) }}</p>
    </div>

    <div class="section">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Ingresos</th>
            <th>Cantidad Vendida</th>
            <th>Órdenes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in data.products" :key="product.sku_id">
            <td><strong>{{ product.rank }}</strong></td>
            <td>{{ product.product_name }}</td>
            <td>{{ product.category }}</td>
            <td class="highlight">${{ formatNumber(product.revenue) }}</td>
            <td>{{ product.quantity }}</td>
            <td>{{ product.orders }}</td>
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

const getPeriodLabel = (period) => {
  const labels = {
    'day': 'Último día',
    'week': 'Última semana',
    'month': 'Último mes',
    'quarter': 'Último trimestre',
    'year': 'Último año'
  };
  return labels[period] || period;
};

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

.section {
  margin-bottom: 2rem;
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

.data-table td.highlight {
  color: #667eea;
  font-weight: 600;
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
