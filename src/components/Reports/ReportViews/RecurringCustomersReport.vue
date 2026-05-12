<template>
  <div class="report-view">
    <div class="report-header">
      <h2>👥 Clientes Recurrentes</h2>
    </div>

    <div class="summary-section">
      <h3>📊 Resumen de Retención</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Clientes Totales</div>
          <div class="metric-value">{{ formatNumber(data.summary.totalCustomers) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Compradores Únicos</div>
          <div class="metric-value">{{ formatNumber(data.summary.oneTimeBuyers) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Clientes Recurrentes</div>
          <div class="metric-value">{{ formatNumber(data.summary.recurringCustomers) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Clientes Leales (5+)</div>
          <div class="metric-value">{{ formatNumber(data.summary.loyalCustomers) }}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>📈 Tasa de Recurrencia</h3>
      <div class="big-metric">
        <div class="big-value">{{ data.summary.recurringRate }}%</div>
        <p>de los clientes han comprado más de una vez</p>
      </div>
    </div>

    <div class="section">
      <h3>💰 Segmentación por Valor</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Segmento</th>
            <th>Clientes</th>
            <th>Ingresos Totales</th>
            <th>% Participación</th>
            <th>Ingreso Promedio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Compradores Únicos</strong></td>
            <td>{{ formatNumber(data.segments.oneTime.customers) }}</td>
            <td>${{ formatNumber(data.segments.oneTime.revenue) }}</td>
            <td>{{ data.segments.oneTime.revenueShare || 0 }}%</td>
            <td>${{ formatNumber(data.segments.oneTime.avgRevenue || 0) }}</td>
          </tr>
          <tr>
            <td><strong>Clientes Recurrentes</strong></td>
            <td>{{ formatNumber(data.segments.recurring.customers) }}</td>
            <td>${{ formatNumber(data.segments.recurring.revenue) }}</td>
            <td>{{ data.segments.recurring.revenueShare || 0 }}%</td>
            <td>${{ formatNumber(data.segments.recurring.avgRevenue || 0) }}</td>
          </tr>
          <tr class="highlight-row">
            <td><strong>Clientes Leales</strong></td>
            <td>{{ formatNumber(data.segments.loyal.customers) }}</td>
            <td>${{ formatNumber(data.segments.loyal.revenue) }}</td>
            <td>{{ data.segments.loyal.revenueShare || 0 }}%</td>
            <td>${{ formatNumber(data.segments.loyal.avgRevenue || 0) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h3>🎯 Insights</h3>
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon">🔄</div>
          <div class="insight-content">
            <h4>Retención</h4>
            <p>{{ data.summary.recurringRate }}% de tus clientes han regresado a comprar</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">⭐</div>
          <div class="insight-content">
            <h4>Lealtad</h4>
            <p>{{ formatNumber(data.summary.loyalCustomers) }} clientes han hecho 5+ compras</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">💎</div>
          <div class="insight-content">
            <h4>Valor por Cliente</h4>
            <p>Los clientes leales generan ${{ formatNumber(data.segments.loyal.avgRevenue || 0) }} en promedio</p>
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
import { defineProps } from 'vue';

defineProps({
  data: {
    type: Object,
    required: true
  }
});

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
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

.big-metric {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.big-value {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.big-metric p {
  font-size: 1.2rem;
  opacity: 0.9;
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

.highlight-row {
  background: #f0f4ff !important;
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
