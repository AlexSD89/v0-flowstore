const fs = require('fs');
const path = require('path');

const { loadOptimizedConfig } = require('./converter');

class UpdateSafeManager {
  constructor({ configRoot, logger = console } = {}) {
    if (!configRoot) {
      throw new Error('UpdateSafeManager 需要提供 configRoot。');
    }

    this.configRoot = configRoot;
    this.logger = logger;
    this.cache = null;
  }

  async ensureReady() {
    ensureDir(this.configRoot);
    ensureDir(path.join(this.configRoot, 'templates'));
  }

  async loadFusionConfig() {
    if (this.cache) {
      return this.cache;
    }

    const config = loadOptimizedConfig(this.configRoot, this.logger);
    this.cache = config;
    return config;
  }

  invalidateCache() {
    this.cache = null;
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

module.exports = UpdateSafeManager;
