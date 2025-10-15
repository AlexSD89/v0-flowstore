/**
 * Simple smoke test to confirm BMAD modules load in Codex environment.
 */

const assert = require('assert');

const tasks = require('../bmad-native-tasks.js');

try {
  assert.ok(tasks, 'Tasks module should load');
  console.log('✅ BMAD tasks module loaded successfully');
} catch (error) {
  console.error('❌ BMAD tasks module failed to load', error);
  process.exit(1);
}
