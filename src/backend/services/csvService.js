import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../models/db');

class CSVService {
  constructor() {
    this.cache = {};
  }

  async loadCSV(filename) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }

    const filePath = path.join(DB_PATH, filename);
    
    return new Promise((resolve, reject) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      Papa.parse(fileContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          this.cache[filename] = results.data;
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  async getCustomers() {
    return await this.loadCSV('bm_customers.csv');
  }

  async getInventory() {
    return await this.loadCSV('bm_inventory.csv');
  }

  async getPromotions() {
    return await this.loadCSV('bm_promotions.csv');
  }

  async getSales() {
    return await this.loadCSV('bm_sales.csv');
  }

  async getProducts() {
    return await this.loadCSV('bm_skus.csv');
  }

  async getStores() {
    return await this.loadCSV('bm_stores.csv');
  }

  clearCache() {
    this.cache = {};
  }
}

export default new CSVService();
