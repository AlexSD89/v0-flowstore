class PerformanceMonitor {
  constructor({ enabled = true, logger = console } = {}) {
    this.enabled = enabled;
    this.logger = logger;
    this.thresholds = {};
    this.records = {
      tasks: [],
      collaborations: [],
      searches: []
    };
  }

  setThresholds(thresholds) {
    this.thresholds = thresholds || {};
  }

  recordTask(taskSummary) {
    if (!this.enabled) return;
    this.records.tasks.push(taskSummary);
    this.logger.debug?.(
      `[Monitor] Task ${taskSummary.taskId} completed in ${taskSummary.durationMs}ms`
    );
  }

  recordCollaboration(collaborationSummary) {
    if (!this.enabled) return;
    this.records.collaborations.push(collaborationSummary);
  }

  recordSearch(searchSummary) {
    if (!this.enabled) return;
    this.records.searches.push(searchSummary);
  }

  snapshot() {
    return {
      thresholds: this.thresholds,
      stats: {
        tasks: this.records.tasks.length,
        collaborations: this.records.collaborations.length,
        searches: this.records.searches.length
      }
    };
  }
}

module.exports = PerformanceMonitor;
