import { jsPDF as jsPDFClass } from 'jspdf';

// Función helper para crear instancia de jsPDF con autoTable
export async function createPDF(options = {}) {
  try {
    const doc = new jsPDFClass(options);
    
    // Importar autoTable dinámicamente
    const autoTableModule = await import('jspdf-autotable');
    const autoTable = autoTableModule.default || autoTableModule;
    
    // Asegurar que autoTable está disponible
    if (typeof doc.autoTable !== 'function') {
      // Intentar cargar manualmente
      if (typeof autoTable === 'function') {
        doc.autoTable = function(config) {
          return autoTable(doc, config);
        };
      } else {
        console.error('jspdf-autotable no está disponible');
        throw new Error('jspdf-autotable no está disponible');
      }
    }
    
    return doc;
  } catch (error) {
    console.error('Error al crear PDF:', error);
    throw error;
  }
}

export { jsPDFClass as jsPDF };
export default createPDF;
