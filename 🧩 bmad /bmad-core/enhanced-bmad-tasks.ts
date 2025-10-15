/**
 * Codex compatibility layer for BMAD enhanced tasks.
 * 实际任务逻辑保留在 bmad-native-tasks.js 与 codex/codex-bmad-native-tasks.js 中。
 */

export { runNativeTaskSuite } from './bmad-native-tasks.js';
export * from './codex/codex-bmad-native-tasks.js';
