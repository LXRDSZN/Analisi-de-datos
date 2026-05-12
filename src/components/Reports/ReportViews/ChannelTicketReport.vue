<template>
  <div class="report-view">
    <div class="report-header">
      <h2>💰 Ticket Promedio por Canal</h2>
    </div>

    <div class="summary-section">
      <h3>📊 Resumen General</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Ingresos Totales</div>
          <div class="metric-value">${{ formatNumber(data.summary.totalRevenue) }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Canal Líder</div>
          <div class="metric-value">{{ data.summary.highestAvgTicket?.channel || 'N/A' }}</div>
          <div class="metric-sublabel">${{ formatNumber(data.summary.highestAvgTicket?.averageTicket || 0) }} promedio</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>📈 Análisis por Canal</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Canal</th>
            <th>Ingresos Totales</th>
            <th>Total Órdenes</th>
            <th>Ticket Promedio</th>
            <th>% Participación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="channel in data.channels" :key="channel.channel">
            <td><strong>{{ channel.channel }}</strong></td>
            <td class="highlight">${{ formatNumber(channel.totalRevenue) }}</td>
            <td>{{ formatNumber(channel.totalOrders) }}</td>
            <td class="ticket-value">${{ formatNumber(channel.averageTicket) }}</td>
            <td>
              <div class="percentage-bar">
                <div class="percentage-fill" :style="{ width: channel.revenueShare + '%' }"></div>
                <span class="percentage-text">{{ channel.revenueShare }}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h3>🎯 Insights por Canal</h3>
      <div class="insights-grid">
        <div v-for="channel in data.channels.slice(0, 3)" :key="channel.channel" class="insight-card">
          <h4>{{ channel.channel }}</h4>
          <div class="insight-metrics">
            <div class="insight-metric">
              <span class="label">Ticket Promedio:</span>
              <span class="value">${{ formatNumber(channel.averageTicket) }}</span>
            </div>
            <div class="insight-metric">
              <span class="label">Órdenes:</span>
              <span class="value">{{ formatNumber(channel.totalOrders) }}</span>
            </div>
            <div class="insight-metric">
              <span class="label">Participación:</span>
              <span class="value">{{ channel.revenueShare }}%</span>
            </div>
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
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

.data-table td.ticket-value {
  font-weight: 600;
  font-size: 1.1rem;
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
  padding: 1.5rem;
  background: #f5f7fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.insight-card h4 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.insight-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.insight-metric {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.insight-metric:last-child {
  border-bottom: none;
}

.insight-metric .label {
  color: #666;
  font-size: 0.9rem;
}

.insight-metric .value {
  color: #333;
  font-weight: 600;
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
