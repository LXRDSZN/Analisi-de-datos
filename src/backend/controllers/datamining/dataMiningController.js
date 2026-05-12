import clusteringService from '../../services/datamining/clusteringService.js';
import associationRulesService from '../../services/datamining/associationRulesService.js';
import predictionService from '../../services/datamining/predictionService.js';

class DataMiningController {
  
  async clusterCustomers(req, res) {
    try {
      const { k = 4 } = req.query;
      const result = await clusteringService.clusterCustomers(parseInt(k));
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in clusterCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Error al realizar clustering de clientes',
        error: error.message
      });
    }
  }
  
  async getAssociationRules(req, res) {
    try {
      const { minSupport = 0.01, minConfidence = 0.3 } = req.query;
      const result = await associationRulesService.getAssociationRules(
        parseFloat(minSupport),
        parseFloat(minConfidence)
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getAssociationRules:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar reglas de asociación',
        error: error.message
      });
    }
  }
  
  async predictSales(req, res) {
    try {
      const { channel, days = 30 } = req.query;
      const result = await predictionService.predictSales(channel, parseInt(days));
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in predictSales:', error);
      res.status(500).json({
        success: false,
        message: 'Error al predecir ventas',
        error: error.message
      });
    }
  }
}

export default new DataMiningController();
