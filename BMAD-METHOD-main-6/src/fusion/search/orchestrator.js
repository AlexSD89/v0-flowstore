class SearchOrchestrator {
  constructor({ updateSafeManager, monitor, enabled = true, logger = console, searchInvoker } = {}) {
    this.updateSafeManager = updateSafeManager;
    this.monitor = monitor;
    this.enabled = enabled;
    this.logger = logger;
    this.searchInvoker = searchInvoker || createDefaultSearchInvoker(logger);
    this.channels = [];
  }

  loadFromConfig(searchConfig) {
    this.channels = searchConfig.channels || [];
    this.logger.debug?.(`[Search] Channels configured: ${this.channels.join(', ') || 'none'}`);
  }

  async execute(query, { taskId, context, maxResults = 6, depth = 'standard' } = {}) {
    if (!this.enabled) {
      return null;
    }

    const startedAt = Date.now();
    const channelResults = await Promise.all(
      this.channels.map(async channel => {
        try {
          const results = await this.searchInvoker(channel, { query, context, maxResults, depth });
          return { channel, success: true, results };
        } catch (error) {
          this.logger.warn?.(`[Search] ${channel} failed: ${error.message}`);
          return { channel, success: false, error: error.message };
        }
      })
    );

    const merged = mergeSearchResults(channelResults, maxResults);
    const summary = {
      taskId,
      query,
      depth,
      channels: channelResults,
      merged,
      durationMs: Date.now() - startedAt
    };

    if (this.monitor) {
      this.monitor.recordSearch(summary);
    }

    return summary;
  }
}

function mergeSearchResults(channelResults, limit) {
  const aggregated = [];
  for (const channel of channelResults) {
    if (!channel.success) continue;
    for (const item of channel.results || []) {
      aggregated.push({
        ...item,
        sourceChannel: channel.channel
      });
    }
  }

  return aggregated.slice(0, limit);
}

function createDefaultSearchInvoker(logger) {
  return async (channel, { query }) => {
    logger.debug?.(`[Search] Mock ${channel} executing for query "${query}"`);
    return [
      {
        title: `${channel} result for ${query}`,
        url: `https://example.com/${channel}?q=${encodeURIComponent(query)}`,
        snippet: `示例：${channel} 针对「${query}」的检索结果。`,
        score: 0.7
      }
    ];
  };
}

module.exports = SearchOrchestrator;
