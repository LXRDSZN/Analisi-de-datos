<template>
  <div class="data-mining-container">
    <h1 class="page-title">🔬 Minería de Datos</h1>
    
    <n-tabs type="line" animated>
      <n-tab-pane name="clustering" tab="Clustering de Clientes">
        <div class="section">
          <div class="section-header">
            <h2>Segmentación de Clientes (K-means)</h2>
            <n-button type="primary" @click="loadClustering" :loading="loadingClustering">
              {{ loadingClustering ? 'Analizando...' : 'Generar Análisis' }}
            </n-button>
          </div>
          
          <div v-if="clusteringData" class="results">
            <div class="stats-grid">
              <div class="stat-card" v-for="cluster in clusteringData.clusters" :key="cluster.clusterId">
                <h3>{{ cluster.clusterName }}</h3>
                <p class="count">{{ cluster.count }} clientes ({{ cluster.percentage }}%)</p>
                <div class="metrics">
                  <div><strong>Recencia:</strong> {{ cluster.avgRecency }} días</div>
                  <div><strong>Frecuencia:</strong> {{ cluster.avgFrequency }} compras</div>
                  <div><strong>Valor:</strong> ${{ cluster.avgMonetary }}</div>
                </div>
                <p class="description">{{ cluster.description }}</p>
              </div>
            </div>
            
            <div class="download-section">
              <n-button type="success" @click="downloadClusteringData">
                📥 Descargar Datos de Clustering (JSON)
              </n-button>
            </div>
          </div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="association" tab="Reglas de Asociación">
        <div class="section">
          <div class="section-header">
            <h2>Market Basket Analysis</h2>
            <n-button type="primary" @click="loadAssociationRules" :loading="loadingRules">
              {{ loadingRules ? 'Analizando...' : 'Generar Análisis' }}
            </n-button>
          </div>
          
          <div v-if="rulesData" class="results">
            <div class="info-box">
              <p><strong>Total de transacciones:</strong> {{ rulesData.totalTransactions }}</p>
              <p><strong>Reglas encontradas:</strong> {{ rulesData.totalRules }}</p>
            </div>
            
            <n-data-table
              :columns="rulesColumns"
              :data="rulesData.rules"
              :pagination="{ pageSize: 10 }"
              :bordered="true"
            />
            
            <div class="download-section">
              <n-button type="success" @click="downloadRulesData">
                📥 Descargar Reglas de Asociación (JSON)
              </n-button>
            </div>
          </div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="prediction" tab="Predicción de Ventas">
        <div class="section">
          <div class="section-header">
            <h2>Predicción de Ventas (30 días)</h2>
            <div class="controls">
              <n-select
                v-model:value="selectedChannel"
                :options="channelOptions"
                placeholder="Seleccionar canal"
                style="width: 200px; margin-right: 1rem;"
              />
              <n-button type="primary" @click="loadPrediction" :loading="loadingPrediction">
                {{ loadingPrediction ? 'Prediciendo...' : 'Generar Predicción' }}
              </n-button>
            </div>
          </div>
          
          <div v-if="predictionData" class="results">
            <div class="trend-box" :class="predictionData.trend.direction">
              <h3>Tendencia: {{ predictionData.trend.direction === 'up' ? '↗️ Crecimiento' : predictionData.trend.direction === 'down' ? '↘️ Decrecimiento' : '→ Estable' }}</h3>
              <p>{{ predictionData.trend.percentage }}% respecto al periodo anterior</p>
            </div>
            
            <div class="chart-container">
              <canvas ref="predictionChart"></canvas>
            </div>
            
            <div class="download-section">
              <n-button type="success" @click="downloadPredictionData">
                📥 Descargar Predicción (JSON)
              </n-button>
            </div>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NTabs, NTabPane, NButton, NDataTable, NSelect } from 'naive-ui';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const loadingClustering = ref(false);
const loadingRules = ref(false);
const loadingPrediction = ref(false);

const clusteringData = ref(null);
const rulesData = ref(null);
const predictionData = ref(null);

const selectedChannel = ref(null);
const channelOptions = [
  { label: 'Todos los canales', value: null },
  { label: 'Store', value: 'Store' },
  { label: 'Website', value: 'Website' },
  { label: 'MobileApp', value: 'MobileApp' },
  { label: 'Amazon.ae', value: 'Amazon.ae' },
  { label: 'Noon', value: 'Noon' }
];

const predictionChart = ref(null);
let chartInstance = null;

const rulesColumns = [
  { title: 'Si compra', key: 'antecedentName', width: 200 },
  { title: 'Entonces compra', key: 'consequentName', width: 200 },
  { title: 'Soporte (%)', key: 'support', width: 100 },
  { title: 'Confianza (%)', key: 'confidence', width: 100 },
  { title: 'Lift', key: 'lift', width: 80 }
];

const loadClustering = async () => {
  loadingClustering.value = true;
  try {
    const response = await axios.get('http://localhost:5000/api/datamining/cluster-customers', {
      withCredentials: true,
      params: { k: 4 }
    });
    clusteringData.value = response.data.data;
  } catch (error) {
    console.error('Error loading clustering:', error);
  } finally {
    loadingClustering.value = false;
  }
};

const loadAssociationRules = async () => {
  loadingRules.value = true;
  try {
    const response = await axios.get('http://localhost:5000/api/datamining/association-rules', {
      withCredentials: true
    });
    rulesData.value = response.data.data;
  } catch (error) {
    console.error('Error loading rules:', error);
  } finally {
    loadingRules.value = false;
  }
};

const loadPrediction = async () => {
  loadingPrediction.value = true;
  try {
    const response = await axios.get('http://localhost:5000/api/datamining/predict-sales', {
      withCredentials: true,
      params: {
        channel: selectedChannel.value,
        days: 30
      }
    });
    predictionData.value = response.data.data;
    renderPredictionChart();
  } catch (error) {
    console.error('Error loading prediction:', error);
  } finally {
    loadingPrediction.value = false;
  }
};

const renderPredictionChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  const ctx = predictionChart.value.getContext('2d');
  const historical = predictionData.value.historical;
  const prediction = predictionData.value.prediction;
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...historical.map(h => h.date), ...prediction.map(p => p.date)],
      datasets: [
        {
          label: 'Ventas Históricas',
          data: [...historical.map(h => h.value), ...Array(prediction.length).fill(null)],
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4
        },
        {
          label: 'Predicción',
          data: [...Array(historical.length).fill(null), ...prediction.map(p => p.value)],
          borderColor: '#f093fb',
          backgroundColor: 'rgba(240, 147, 251, 0.1)',
          borderDash: [5, 5],
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
};

const downloadClusteringData = () => {
  const dataStr = JSON.stringify(clusteringData.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `clustering_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadRulesData = () => {
  const dataStr = JSON.stringify(rulesData.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `association_rules_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadPredictionData = () => {
  const dataStr = JSON.stringify(predictionData.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sales_prediction_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.data-mining-container {
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #667eea;
}

.controls {
  display: flex;
  align-items: center;
}

.results {
  margin-top: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.stat-card h3 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.stat-card .count {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1rem 0;
  color: #333;
}

.stat-card .metrics {
  margin: 1rem 0;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-card .metrics div {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.stat-card .description {
  font-size: 0.85rem;
  color: #666;
  margin-top: 1rem;
  line-height: 1.4;
}

.info-box {
  background: #f0f4ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.info-box p {
  margin: 0.5rem 0;
}

.trend-box {
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.trend-box.up {
  background: #e6ffe6;
  border: 2px solid #4caf50;
}

.trend-box.down {
  background: #ffe6e6;
  border: 2px solid #f44336;
}

.trend-box.stable {
  background: #fff3e6;
  border: 2px solid #ff9800;
}

.trend-box h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.chart-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: 400px;
  margin-bottom: 2rem;
}

.download-section {
  margin-top: 2rem;
  text-align: center;
}
</style>
