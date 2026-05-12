import csvService from '../csvService.js';

class ClusteringService {
  
  async clusterCustomers(k = 4) {
    const customers = await csvService.getCustomers();
    const sales = await csvService.getSales();
    
    const customerMetrics = this.calculateRFMMetrics(customers, sales);
    
    const data = customerMetrics.map(c => [
      c.recencyNorm,
      c.frequencyNorm,
      c.monetaryNorm
    ]);
    
    const result = this.simpleKMeans(data, k);
    
    const clusteredCustomers = customerMetrics.map((customer, index) => ({
      ...customer,
      cluster: result.clusters[index],
      clusterName: this.getClusterName(result.clusters[index], k)
    }));
    
    const clusterStats = this.calculateClusterStats(clusteredCustomers, k);
    
    return {
      customers: clusteredCustomers,
      clusters: clusterStats,
      centroids: result.centroids,
      totalCustomers: clusteredCustomers.length,
      k
    };
  }
  
  simpleKMeans(data, k) {
    const centroids = this.initializeCentroids(data, k);
    let clusters = [];
    let changed = true;
    let iterations = 0;
    const maxIterations = 100;
    
    while (changed && iterations < maxIterations) {
      clusters = this.assignClusters(data, centroids);
      const newCentroids = this.updateCentroids(data, clusters, k);
      changed = !this.centroidsEqual(centroids, newCentroids);
      centroids.splice(0, centroids.length, ...newCentroids);
      iterations++;
    }
    
    return { clusters, centroids };
  }
  
  initializeCentroids(data, k) {
    const centroids = [];
    const indices = new Set();
    
    while (centroids.length < k) {
      const idx = Math.floor(Math.random() * data.length);
      if (!indices.has(idx)) {
        indices.add(idx);
        centroids.push([...data[idx]]);
      }
    }
    
    return centroids;
  }
  
  assignClusters(data, centroids) {
    return data.map(point => {
      let minDist = Infinity;
      let cluster = 0;
      
      centroids.forEach((centroid, i) => {
        const dist = this.euclideanDistance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          cluster = i;
        }
      });
      
      return cluster;
    });
  }
  
  euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }
  
  updateCentroids(data, clusters, k) {
    const newCentroids = [];
    
    for (let i = 0; i < k; i++) {
      const clusterPoints = data.filter((_, idx) => clusters[idx] === i);
      
      if (clusterPoints.length === 0) {
        newCentroids.push(data[Math.floor(Math.random() * data.length)]);
        continue;
      }
      
      const dimensions = data[0].length;
      const centroid = Array(dimensions).fill(0);
      
      clusterPoints.forEach(point => {
        point.forEach((val, dim) => {
          centroid[dim] += val;
        });
      });
      
      newCentroids.push(centroid.map(sum => sum / clusterPoints.length));
    }
    
    return newCentroids;
  }
  
  centroidsEqual(c1, c2) {
    if (c1.length !== c2.length) return false;
    
    return c1.every((centroid, i) =>
      centroid.every((val, j) => Math.abs(val - c2[i][j]) < 0.001)
    );
  }
  
  calculateRFMMetrics(customers, sales) {
    const today = new Date('2023-12-31');
    const customerMap = new Map();
    
    customers.forEach(customer => {
      customerMap.set(customer.cust_id, {
        cust_id: customer.cust_id,
        age: customer.age,
        gender: customer.gender,
        city: customer.city,
        loyalty_segment: customer.loyalty_segment,
        purchases: [],
        totalSpent: 0,
        lastPurchaseDate: null
      });
    });
    
    sales.forEach(sale => {
      if (customerMap.has(sale.customer_id)) {
        const customer = customerMap.get(sale.customer_id);
        customer.purchases.push(sale);
        customer.totalSpent += parseFloat(sale.total_value || 0);
        
        const saleDate = new Date(sale.date);
        if (!customer.lastPurchaseDate || saleDate > customer.lastPurchaseDate) {
          customer.lastPurchaseDate = saleDate;
        }
      }
    });
    
    const metrics = Array.from(customerMap.values()).map(customer => {
      const recency = customer.lastPurchaseDate 
        ? Math.floor((today - customer.lastPurchaseDate) / (1000 * 60 * 60 * 24))
        : 365;
      
      return {
        cust_id: customer.cust_id,
        age: customer.age,
        gender: customer.gender,
        city: customer.city,
        loyalty_segment: customer.loyalty_segment,
        recency: recency,
        frequency: customer.purchases.length,
        monetary: customer.totalSpent,
        recencyNorm: this.normalize(recency, 0, 365),
        frequencyNorm: this.normalize(customer.purchases.length, 0, 200),
        monetaryNorm: this.normalize(customer.totalSpent, 0, 50000)
      };
    });
    
    return metrics;
  }
  
  normalize(value, min, max) {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }
  
  getClusterName(clusterIndex, k) {
    if (k === 4) {
      const names = ['Champions', 'Loyal Customers', 'At Risk', 'Lost Customers'];
      return names[clusterIndex] || `Cluster ${clusterIndex}`;
    }
    return `Cluster ${clusterIndex}`;
  }
  
  calculateClusterStats(clusteredCustomers, k) {
    const clusters = [];
    
    for (let i = 0; i < k; i++) {
      const clusterCustomers = clusteredCustomers.filter(c => c.cluster === i);
      
      if (clusterCustomers.length === 0) continue;
      
      const avgRecency = clusterCustomers.reduce((sum, c) => sum + c.recency, 0) / clusterCustomers.length;
      const avgFrequency = clusterCustomers.reduce((sum, c) => sum + c.frequency, 0) / clusterCustomers.length;
      const avgMonetary = clusterCustomers.reduce((sum, c) => sum + c.monetary, 0) / clusterCustomers.length;
      
      clusters.push({
        clusterId: i,
        clusterName: this.getClusterName(i, k),
        count: clusterCustomers.length,
        percentage: ((clusterCustomers.length / clusteredCustomers.length) * 100).toFixed(2),
        avgRecency: Math.round(avgRecency),
        avgFrequency: Math.round(avgFrequency),
        avgMonetary: parseFloat(avgMonetary.toFixed(2)),
        description: this.getClusterDescription(i, k)
      });
    }
    
    return clusters;
  }
  
  getClusterDescription(clusterIndex, k) {
    if (k === 4) {
      const descriptions = [
        'Clientes de alto valor que compran frecuentemente y recientemente',
        'Clientes leales con buen historial de compras',
        'Clientes que no han comprado recientemente, requieren atención',
        'Clientes inactivos que no han comprado en mucho tiempo'
      ];
      return descriptions[clusterIndex] || 'Grupo de clientes';
    }
    return 'Grupo de clientes con características similares';
  }
}

export default new ClusteringService();
