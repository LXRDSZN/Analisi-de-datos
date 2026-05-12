import csvService from '../csvService.js';

class PredictionService {
  
  async predictSales(channel = null, days = 30) {
    const sales = await csvService.getSales();
    
    let filteredSales = sales;
    if (channel) {
      filteredSales = sales.filter(s => s.channel === channel);
    }
    
    const dailySales = this.aggregateDailySales(filteredSales);
    const sortedDates = Object.keys(dailySales).sort();
    
    const timeSeries = sortedDates.map(date => dailySales[date]);
    
    const prediction = this.simpleMovingAverage(timeSeries, 7, days);
    const trend = this.calculateTrend(timeSeries);
    
    return {
      historical: this.formatHistoricalData(sortedDates, timeSeries),
      prediction: this.formatPrediction(prediction, sortedDates[sortedDates.length - 1], days),
      trend: trend,
      channel: channel || 'All',
      historicalDays: timeSeries.length,
      predictionDays: days
    };
  }
  
  aggregateDailySales(sales) {
    const dailySales = {};
    
    sales.forEach(sale => {
      const date = sale.date;
      if (!dailySales[date]) {
        dailySales[date] = 0;
      }
      dailySales[date] += parseFloat(sale.total_value || 0);
    });
    
    return dailySales;
  }
  
  simpleMovingAverage(timeSeries, windowSize, forecastDays) {
    const predictions = [];
    const lastValues = timeSeries.slice(-windowSize);
    const average = lastValues.reduce((sum, val) => sum + val, 0) / windowSize;
    
    for (let i = 0; i < forecastDays; i++) {
      predictions.push(average);
    }
    
    return predictions;
  }
  
  calculateTrend(timeSeries) {
    if (timeSeries.length < 2) return 0;
    
    const n = timeSeries.length;
    const recent = timeSeries.slice(-30);
    const older = timeSeries.slice(-60, -30);
    
    if (older.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    const trendPercentage = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    return {
      percentage: parseFloat(trendPercentage.toFixed(2)),
      direction: trendPercentage > 0 ? 'up' : trendPercentage < 0 ? 'down' : 'stable',
      recentAvg: parseFloat(recentAvg.toFixed(2)),
      olderAvg: parseFloat(olderAvg.toFixed(2))
    };
  }
  
  formatHistoricalData(dates, values) {
    return dates.slice(-90).map((date, index) => ({
      date: date,
      value: parseFloat(values[values.length - 90 + index]?.toFixed(2) || 0)
    }));
  }
  
  formatPrediction(predictions, lastDate, days) {
    const result = [];
    const startDate = new Date(lastDate);
    
    for (let i = 0; i < days; i++) {
      const predDate = new Date(startDate);
      predDate.setDate(predDate.getDate() + i + 1);
      
      result.push({
        date: predDate.toISOString().split('T')[0],
        value: parseFloat(predictions[i].toFixed(2))
      });
    }
    
    return result;
  }
}

export default new PredictionService();
