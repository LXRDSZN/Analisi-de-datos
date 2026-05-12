<template>
  <div class="reports-container">
    <h1 class="page-title">📄 Reportes Automatizados</h1>
    
    <div class="reports-grid">
      <div class="report-card">
        <div class="report-icon">📊</div>
        <h3>Ventas Totales Diarias</h3>
        <p>Reporte de ventas del día, incluye totales por canal y productos</p>
        <div class="report-actions">
          <n-button type="primary" @click="viewDailySales" :loading="loading.dailySales">
            Ver Reporte
          </n-button>
          <n-button type="success" @click="downloadDailySales" :loading="downloading.dailySales">
            📥 Descargar
          </n-button>
        </div>
      </div>
      
      <div class="report-card">
        <div class="report-icon">🏆</div>
        <h3>Top 10 Productos</h3>
        <p>Productos más vendidos del mes con métricas detalladas</p>
        <div class="report-actions">
          <n-button type="primary" @click="viewTopProducts" :loading="loading.topProducts">
            Ver Reporte
          </n-button>
          <n-button type="success" @click="downloadTopProducts" :loading="downloading.topProducts">
            📥 Descargar
          </n-button>
        </div>
      </div>
      
      <div class="report-card">
        <div class="report-icon">🏪</div>
        <h3>Rendimiento por Tienda</h3>
        <p>Análisis comparativo de todas las tiendas físicas</p>
        <div class="report-actions">
          <n-button type="primary" @click="viewStorePerformance" :loading="loading.storePerf">
            Ver Reporte
          </n-button>
          <n-button type="success" @click="downloadStorePerformance" :loading="downloading.storePerf">
            📥 Descargar
          </n-button>
        </div>
      </div>
      
      <div class="report-card">
        <div class="report-icon">💰</div>
        <h3>Ticket Promedio por Canal</h3>
        <p>Valor promedio de compra en cada canal de venta</p>
        <div class="report-actions">
          <n-button type="primary" @click="viewAvgTicket" :loading="loading.avgTicket">
            Ver Reporte
          </n-button>
          <n-button type="success" @click="downloadAvgTicket" :loading="downloading.avgTicket">
            📥 Descargar
          </n-button>
        </div>
      </div>
      
      <div class="report-card">
        <div class="report-icon">🏷️</div>
        <h3>% Ventas con Descuento</h3>
        <p>Análisis de transacciones con promociones aplicadas</p>
        <div class="report-actions">
          <n-button type="primary" @click="viewDiscountSales" :loading="loading.discount">
            Ver Reporte
          </n-button>
          <n-button type="success" @click="downloadDiscountSales" :loading="downloading.discount">
            📥 Descargar
          </n-button>
        </div>
      </div>
      
      <div class="report-card">
        <div class="report-icon">👥</div>
        <h3>Clientes Recurrentes</h3>
        <p>Análisis de fidelización y frecuencia de compra</p>
        <div class="report-actions">
          <n-button type="primary" @click="viewRecurringCustomers" :loading="loading.recurring">
            Ver Reporte
          </n-button>
          <n-button type="success" @click="downloadRecurringCustomers" :loading="downloading.recurring">
            📥 Descargar
          </n-button>
        </div>
      </div>
      
      <div class="report-card featured">
        <div class="report-icon">📋</div>
        <h3>Reporte Ejecutivo Semanal</h3>
        <p>Reporte completo con todos los KPIs y métricas clave</p>
        <div class="report-actions">
          <n-button type="primary" @click="viewWeeklyExecutive" :loading="loading.weekly">
            Ver Reporte
          </n-button>
          <n-button type="success" @click="downloadWeeklyExecutive" :loading="downloading.weekly">
            📥 Descargar
          </n-button>
        </div>
      </div>
    </div>
    
    <n-modal v-model:show="showModal" :style="{ width: '90%', maxWidth: '1400px' }">
      <n-card :title="modalTitle" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <div class="modal-content" ref="reportContent">
          <component :is="currentReportComponent" :data="modalData" :title="modalTitle" v-if="modalData" />
        </div>
        <template #footer>
          <div class="modal-footer-actions">
            <n-button type="success" @click="downloadAsPDF" :loading="downloadingPDF">
              📄 Descargar PDF
            </n-button>
            <n-button type="info" @click="downloadAsHTML">
              🌐 Descargar HTML
            </n-button>
            <n-button @click="showModal = false">Cerrar</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted } from 'vue';
import { NButton, NModal, NCard } from 'naive-ui';
import axios from 'axios';
import createPDF from '@/utils/pdfGenerator.js';
import DailySalesReport from './ReportViews/DailySalesReport.vue';
import WeeklyExecutiveReport from './ReportViews/WeeklyExecutiveReport.vue';
import TopProductsReport from './ReportViews/TopProductsReport.vue';
import StorePerformanceReport from './ReportViews/StorePerformanceReport.vue';
import ChannelTicketReport from './ReportViews/ChannelTicketReport.vue';
import DiscountSalesReport from './ReportViews/DiscountSalesReport.vue';
import RecurringCustomersReport from './ReportViews/RecurringCustomersReport.vue';
import GenericReport from './ReportViews/GenericReport.vue';

const loading = ref({
  dailySales: false,
  topProducts: false,
  storePerf: false,
  avgTicket: false,
  discount: false,
  recurring: false,
  weekly: false
});

const downloading = ref({
  dailySales: false,
  topProducts: false,
  storePerf: false,
  avgTicket: false,
  discount: false,
  recurring: false,
  weekly: false
});

const showModal = ref(false);
const modalTitle = ref('');
const modalData = ref(null);
const currentReportComponent = ref(null);
const reportContent = ref(null);
const downloadingPDF = ref(false);
const currentFilename = ref('reporte');

const viewReport = async (endpoint, title, loadingKey, component) => {
  loading.value[loadingKey] = true;
  try {
    const response = await axios.get(`http://localhost:5000/api/reports/${endpoint}`, {
      withCredentials: true
    });
    modalTitle.value = title;
    modalData.value = response.data.data;
    currentReportComponent.value = markRaw(component);
    currentFilename.value = endpoint.replace(/\//g, '_');
    showModal.value = true;
  } catch (error) {
    console.error('Error loading report:', error);
    alert('Error al cargar el reporte');
  } finally {
    loading.value[loadingKey] = false;
  }
};

const downloadAsPDF = async () => {
  downloadingPDF.value = true;
  try {
    const doc = await createPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Verificar que autoTable está disponible
    if (typeof doc.autoTable !== 'function') {
      throw new Error('autoTable plugin no está cargado correctamente. Por favor recarga la página.');
    }
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    // Header
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(modalTitle.value, pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado: ${new Date().toLocaleDateString('es-MX', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    })}`, pageWidth / 2, 25, { align: 'center' });

    yPos = 45;
    doc.setTextColor(0, 0, 0);

    // Generate content based on report type
    if (currentFilename.value === 'daily-sales') {
      yPos = generateDailySalesPDF(doc, modalData.value, yPos, pageWidth, margin);
    } else if (currentFilename.value === 'top-products') {
      yPos = generateTopProductsPDF(doc, modalData.value, yPos, pageWidth, margin);
    } else if (currentFilename.value === 'store-performance') {
      yPos = generateStorePerformancePDF(doc, modalData.value, yPos, pageWidth, margin);
    } else if (currentFilename.value === 'average-ticket-by-channel') {
      yPos = generateChannelTicketPDF(doc, modalData.value, yPos, pageWidth, margin);
    } else if (currentFilename.value === 'discount-sales') {
      yPos = generateDiscountSalesPDF(doc, modalData.value, yPos, pageWidth, margin);
    } else if (currentFilename.value === 'recurring-customers') {
      yPos = generateRecurringCustomersPDF(doc, modalData.value, yPos, pageWidth, margin);
    } else if (currentFilename.value === 'weekly-executive') {
      yPos = generateWeeklyExecutivePDF(doc, modalData.value, yPos, pageWidth, margin);
    }

    // Footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `BlueMart Analytics - Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    doc.save(`${currentFilename.value}_${new Date().toISOString().split('T')[0]}.pdf`);
    alert('PDF descargado exitosamente');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error al generar PDF: ' + error.message);
  } finally {
    downloadingPDF.value = false;
  }
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const generateDailySalesPDF = (doc, data, yPos, pageWidth, margin) => {
  // Summary metrics
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('📈 Resumen General', margin, yPos);
  yPos += 10;

  const metrics = [
    ['Ingresos Totales', `$${formatNumber(data.summary?.totalRevenue || 0)}`],
    ['Total de Órdenes', formatNumber(data.summary?.totalOrders || 0)],
    ['Cantidad Total', formatNumber(data.summary?.totalQuantity || 0)],
    ['Ticket Promedio', `$${formatNumber(data.summary?.averageTicket || 0)}`]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: metrics,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: margin, right: margin }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // By channel
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('🛒 Ventas por Canal', margin, yPos);
  yPos += 5;

  const channelData = (data.byChannel || []).map(ch => [
    ch.channel || 'N/A',
    `$${formatNumber(ch.revenue || 0)}`,
    (ch.orders || 0).toString()
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Canal', 'Ingresos', 'Órdenes']],
    body: channelData,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: margin, right: margin }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // Top products
  if (data.topProducts && data.topProducts.length) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('🏆 Top Productos del Día', margin, yPos);
    yPos += 5;

    const productData = data.topProducts.slice(0, 5).map(p => [
      p.rank.toString(),
      p.product_name,
      p.category,
      `$${formatNumber(p.revenue)}`,
      p.quantity.toString()
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Producto', 'Categoría', 'Ingresos', 'Cantidad']],
      body: productData,
      theme: 'grid',
      headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: margin, right: margin }
    });
  }

  return doc.lastAutoTable.finalY;
};

const generateTopProductsPDF = (doc, data, yPos, pageWidth, margin) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('🏆 Top 10 Productos Más Vendidos', margin, yPos);
  yPos += 10;

  const productData = data.products.map(p => [
    p.rank.toString(),
    p.product_name,
    p.category,
    `$${formatNumber(p.revenue)}`,
    p.quantity.toString(),
    p.orders.toString()
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['#', 'Producto', 'Categoría', 'Ingresos', 'Cantidad', 'Órdenes']],
    body: productData,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
    margin: { left: margin, right: margin },
    columnStyles: {
      1: { cellWidth: 50 },
      2: { cellWidth: 35 }
    }
  });

  return doc.lastAutoTable.finalY;
};

const generateStorePerformancePDF = (doc, data, yPos, pageWidth, margin) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('🏪 Rendimiento por Tienda', margin, yPos);
  yPos += 10;

  const storeData = data.stores.map(s => [
    s.rank.toString(),
    s.store_name,
    s.city,
    `$${formatNumber(s.revenue)}`,
    s.orders.toString(),
    `$${formatNumber(s.avgTicket)}`
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['#', 'Tienda', 'Ciudad', 'Ingresos', 'Órdenes', 'Ticket Prom.']],
    body: storeData,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
    margin: { left: margin, right: margin }
  });

  return doc.lastAutoTable.finalY;
};

const generateChannelTicketPDF = (doc, data, yPos, pageWidth, margin) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('💰 Ticket Promedio por Canal', margin, yPos);
  yPos += 10;

  const channelData = data.channels.map(ch => [
    ch.channel,
    `$${formatNumber(ch.avgTicket)}`,
    ch.orders.toString(),
    `$${formatNumber(ch.totalRevenue)}`
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Canal', 'Ticket Promedio', 'Órdenes', 'Ingresos Totales']],
    body: channelData,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: margin, right: margin }
  });

  return doc.lastAutoTable.finalY;
};

const generateDiscountSalesPDF = (doc, data, yPos, pageWidth, margin) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('🏷️ Análisis de Ventas con Descuento', margin, yPos);
  yPos += 10;

  const summary = [
    ['Ventas Totales', `$${formatNumber(data.summary.totalSales)}`],
    ['Ventas con Descuento', `$${formatNumber(data.summary.salesWithDiscount)}`],
    ['Porcentaje', `${data.summary.percentageWithDiscount}%`],
    ['Descuento Promedio', `${data.summary.avgDiscountPercent}%`]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: summary,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: margin, right: margin }
  });

  return doc.lastAutoTable.finalY;
};

const generateRecurringCustomersPDF = (doc, data, yPos, pageWidth, margin) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('👥 Análisis de Clientes Recurrentes', margin, yPos);
  yPos += 10;

  const summary = [
    ['Total de Clientes', data.summary.totalCustomers.toString()],
    ['Clientes Recurrentes', data.summary.recurringCustomers.toString()],
    ['Porcentaje', `${data.summary.recurringPercentage}%`],
    ['Compras Promedio', data.summary.avgPurchasesPerCustomer.toString()]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: summary,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: margin, right: margin }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  if (data.topRecurring && data.topRecurring.length) {
    doc.setFontSize(12);
    doc.text('Top 10 Clientes Más Frecuentes', margin, yPos);
    yPos += 5;

    const customerData = data.topRecurring.slice(0, 10).map((c, i) => [
      (i + 1).toString(),
      c.customer_name,
      c.purchases.toString(),
      `$${formatNumber(c.totalSpent)}`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Cliente', 'Compras', 'Total Gastado']],
      body: customerData,
      theme: 'grid',
      headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: margin, right: margin }
    });
  }

  return doc.lastAutoTable.finalY;
};

const generateWeeklyExecutivePDF = (doc, data, yPos, pageWidth, margin) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text('📋 Reporte Ejecutivo Semanal', margin, yPos);
  yPos += 10;

  // KPIs principales
  const kpis = [
    ['Ingresos Totales', `$${formatNumber(data.kpis.totalRevenue)}`],
    ['Órdenes Totales', formatNumber(data.kpis.totalOrders)],
    ['Ticket Promedio', `$${formatNumber(data.kpis.avgTicket)}`],
    ['Productos Vendidos', formatNumber(data.kpis.productsSold)]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['KPI', 'Valor']],
    body: kpis,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: margin, right: margin }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // Top productos
  if (data.topProducts && data.topProducts.length) {
    doc.setFontSize(12);
    doc.text('Top 5 Productos', margin, yPos);
    yPos += 5;

    const productData = data.topProducts.slice(0, 5).map((p, i) => [
      (i + 1).toString(),
      p.product_name,
      `$${formatNumber(p.revenue)}`,
      p.quantity.toString()
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Producto', 'Ingresos', 'Cantidad']],
      body: productData,
      theme: 'grid',
      headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 10;
  }

  // Ventas por canal
  if (data.byChannel && data.byChannel.length) {
    doc.setFontSize(12);
    doc.text('Ventas por Canal', margin, yPos);
    yPos += 5;

    const channelData = data.byChannel.map(ch => [
      ch.channel,
      `$${formatNumber(ch.revenue)}`,
      ch.orders.toString()
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Canal', 'Ingresos', 'Órdenes']],
      body: channelData,
      theme: 'grid',
      headStyles: { fillColor: [102, 126, 234], fontSize: 10, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: margin, right: margin }
    });
  }

  return doc.lastAutoTable.finalY;
};

const downloadAsHTML = () => {
  try {
    const element = reportContent.value;
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${modalTitle.value}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f7fa;
    }
    ${getReportStyles()}
  </style>
</head>
<body>
  ${element.innerHTML}
</body>
</html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentFilename.value}_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
    alert('HTML descargado exitosamente');
  } catch (error) {
    console.error('Error downloading HTML:', error);
    alert('Error al descargar HTML');
  }
};

const getReportStyles = () => {
  return `
    .report-view {
      background: white;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
    .section {
      margin-bottom: 2rem;
    }
    .section h3, .summary-section h3 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 1.3rem;
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
  `;
};

const downloadReport = async (endpoint, filename, downloadingKey) => {
  downloading.value[downloadingKey] = true;
  try {
    const response = await axios.get(`http://localhost:5000/api/reports/${endpoint}`, {
      withCredentials: true
    });
    
    const dataStr = JSON.stringify(response.data.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Reporte descargado exitosamente');
  } catch (error) {
    console.error('Error downloading report:', error);
    alert('Error al descargar reporte');
  } finally {
    downloading.value[downloadingKey] = false;
  }
};

const viewDailySales = () => viewReport('daily-sales', 'Ventas Diarias', 'dailySales', DailySalesReport);
const viewTopProducts = () => viewReport('top-products', 'Top 10 Productos', 'topProducts', TopProductsReport);
const viewStorePerformance = () => viewReport('store-performance', 'Rendimiento por Tienda', 'storePerf', StorePerformanceReport);
const viewAvgTicket = () => viewReport('average-ticket-by-channel', 'Ticket Promedio por Canal', 'avgTicket', ChannelTicketReport);
const viewDiscountSales = () => viewReport('discount-sales', '% Ventas con Descuento', 'discount', DiscountSalesReport);
const viewRecurringCustomers = () => viewReport('recurring-customers', 'Clientes Recurrentes', 'recurring', RecurringCustomersReport);
const viewWeeklyExecutive = () => viewReport('weekly-executive', 'Reporte Ejecutivo Semanal', 'weekly', WeeklyExecutiveReport);

const downloadDailySales = () => downloadReport('download/daily-sales', 'ventas_diarias', 'dailySales');
const downloadTopProducts = () => downloadReport('top-products', 'top_productos', 'topProducts');
const downloadStorePerformance = () => downloadReport('store-performance', 'rendimiento_tiendas', 'storePerf');
const downloadAvgTicket = () => downloadReport('average-ticket-by-channel', 'ticket_promedio', 'avgTicket');
const downloadDiscountSales = () => downloadReport('discount-sales', 'ventas_descuento', 'discount');
const downloadRecurringCustomers = () => downloadReport('recurring-customers', 'clientes_recurrentes', 'recurring');
const downloadWeeklyExecutive = () => downloadReport('download/weekly-executive', 'reporte_ejecutivo_semanal', 'weekly');
</script>

<style scoped>
.reports-container {
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.report-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.report-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.report-card.featured {
  grid-column: span 2;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.report-card.featured h3 {
  color: white;
}

.report-card.featured p {
  color: rgba(255,255,255,0.9);
}

.report-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.report-card h3 {
  font-size: 1.3rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.report-card p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.report-actions {
  display: flex;
  gap: 1rem;
}

.report-actions button {
  flex: 1;
}

.modal-content {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.modal-footer-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .report-card.featured {
    grid-column: span 1;
  }
  
  .modal-footer-actions {
    flex-direction: column;
  }
}
</style>
