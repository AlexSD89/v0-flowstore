/**
 * Entry point exporting the v6 Fusion Core orchestrator.
 */

const FusionCore = require('./core/v6-fusion-core');

function createFusionCore(options = {}) {
  return new FusionCore(options);
}

module.exports = {
  FusionCore,
  createFusionCore
};
