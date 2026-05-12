import csvService from '../csvService.js';

class AssociationRulesService {
  
  async getAssociationRules(minSupport = 0.001, minConfidence = 0.2) {
    const sales = await csvService.getSales();
    const products = await csvService.getProducts();
    
    const transactions = this.groupTransactions(sales);
    const frequentItemsets = this.findFrequentItemsets(transactions, minSupport);
    const rules = this.generateRules(frequentItemsets, transactions.length, minConfidence);
    const enrichedRules = this.enrichRulesWithProductInfo(rules, products);
    
    return {
      rules: enrichedRules.slice(0, 50),
      totalTransactions: transactions.length,
      totalRules: enrichedRules.length,
      minSupport,
      minConfidence,
      multiItemTransactions: transactions.filter(t => t.length > 1).length,
      warning: enrichedRules.length === 0 ? 'No se encontraron reglas con los umbrales actuales. La mayoría de las transacciones contienen un solo producto.' : null
    };
  }
  
  groupTransactions(sales) {
    const transactionMap = new Map();
    
    sales.forEach(sale => {
      const transactionKey = `${sale.date}-${sale.customer_id}-${sale.store_id}`;
      if (!transactionMap.has(transactionKey)) {
        transactionMap.set(transactionKey, new Set());
      }
      transactionMap.get(transactionKey).add(sale.sku_id);
    });
    
    return Array.from(transactionMap.values()).map(set => Array.from(set));
  }
  
  findFrequentItemsets(transactions, minSupport) {
    const totalTransactions = transactions.length;
    const minSupportCount = Math.ceil(totalTransactions * minSupport);
    
    const itemCounts = new Map();
    transactions.forEach(transaction => {
      transaction.forEach(item => {
        itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
      });
    });
    
    const frequentItems = Array.from(itemCounts.entries())
      .filter(([item, count]) => count >= minSupportCount)
      .map(([item, count]) => ({
        items: [item],
        support: count / totalTransactions,
        count: count
      }));
    
    const pairs = this.generatePairs(transactions, frequentItems, minSupportCount, totalTransactions);
    
    return [...frequentItems, ...pairs];
  }
  
  generatePairs(transactions, frequentItems, minSupportCount, totalTransactions) {
    const pairCounts = new Map();
    const frequentItemsSet = new Set(frequentItems.map(f => f.items[0]));
    
    transactions.forEach(transaction => {
      const items = transaction.filter(item => frequentItemsSet.has(item));
      
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const pair = [items[i], items[j]].sort().join(',');
          pairCounts.set(pair, (pairCounts.get(pair) || 0) + 1);
        }
      }
    });
    
    return Array.from(pairCounts.entries())
      .filter(([pair, count]) => count >= minSupportCount)
      .map(([pair, count]) => ({
        items: pair.split(','),
        support: count / totalTransactions,
        count: count
      }));
  }
  
  generateRules(frequentItemsets, totalTransactions, minConfidence) {
    const rules = [];
    const pairs = frequentItemsets.filter(itemset => itemset.items.length === 2);
    const singles = frequentItemsets.filter(itemset => itemset.items.length === 1);
    
    const singleSupport = new Map(singles.map(s => [s.items[0], s.support]));
    
    pairs.forEach(pair => {
      const [item1, item2] = pair.items;
      const pairSupport = pair.support;
      
      const confidence1 = pairSupport / (singleSupport.get(item1) || 1);
      if (confidence1 >= minConfidence) {
        const lift = confidence1 / (singleSupport.get(item2) || 1);
        rules.push({
          antecedent: [item1],
          consequent: [item2],
          support: pairSupport,
          confidence: confidence1,
          lift: lift,
          count: pair.count
        });
      }
      
      const confidence2 = pairSupport / (singleSupport.get(item2) || 1);
      if (confidence2 >= minConfidence) {
        const lift = confidence2 / (singleSupport.get(item1) || 1);
        rules.push({
          antecedent: [item2],
          consequent: [item1],
          support: pairSupport,
          confidence: confidence2,
          lift: lift,
          count: pair.count
        });
      }
    });
    
    return rules.sort((a, b) => b.lift - a.lift);
  }
  
  enrichRulesWithProductInfo(rules, products) {
    const productMap = new Map(products.map(p => [p.sku_id, p]));
    
    return rules.map(rule => {
      const antecedentProduct = productMap.get(rule.antecedent[0]);
      const consequentProduct = productMap.get(rule.consequent[0]);
      
      return {
        ...rule,
        antecedentName: antecedentProduct?.sku_name || rule.antecedent[0],
        consequentName: consequentProduct?.sku_name || rule.consequent[0],
        antecedentCategory: antecedentProduct?.category,
        consequentCategory: consequentProduct?.category,
        support: parseFloat((rule.support * 100).toFixed(2)),
        confidence: parseFloat((rule.confidence * 100).toFixed(2)),
        lift: parseFloat(rule.lift.toFixed(2))
      };
    });
  }
}

export default new AssociationRulesService();
