import channelMartService from '../../services/datamart/channelMartService.js';

class ChannelMartController {
  
  /**
   * GET /api/datamart/channels
   * Obtiene análisis de todos los canales
   */
  async getAllChannels(req, res) {
    try {
      const data = await channelMartService.getChannelMart();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error in getAllChannels:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener análisis de canales',
        error: error.message
      });
    }
  }

  /**
   * GET /api/datamart/channels/:channel
   * Obtiene análisis de un canal específico
   */
  async getChannelAnalysis(req, res) {
    try {
      const { channel } = req.params;
      const validChannels = ['Store', 'Website', 'MobileApp', 'Amazon.ae', 'Noon'];
      
      if (!validChannels.includes(channel)) {
        return res.status(400).json({
          success: false,
          message: `Canal inválido. Canales válidos: ${validChannels.join(', ')}`
        });
      }
      
      const data = await channelMartService.getChannelMart(channel);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error in getChannelAnalysis:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener análisis del canal',
        error: error.message
      });
    }
  }
}

export default new ChannelMartController();
