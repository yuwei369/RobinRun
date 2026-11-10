/**
 * RobinRun session UI 状态 store
 *
 * 一个 tab 对应一个 workspace，所以聊天相关状态也必须按 workspace 分桶保存。
 * 这样切换标签页时，当前任务、输入中的草稿态和初始化状态才不会互相串台。
 */
import { create } from "zustand";
import { shouldExposeE2EStoreBridge } from "@/lib/e2eStoreBridge.js";
import { type RobinRunSessionStoreState } from "./robinrunSessionStoreTypes.js";
import { getWorkspaceState } from "./robinrunSessionStoreSelectors.js";
import { createNavigationSlice } from "./robinrunSessionStoreNavigation.js";
import { createTaskSlice } from "./robinrunSessionStoreTaskSlice.js";
import { createWorkspaceSlice } from "./robinrunSessionStoreWorkspaceSlice.js";
import { uiMemoryDiagnosticsRegistry } from "@/lib/memoryDiagnostics.js";

export const useRobinRunSessionStore = create<RobinRunSessionStoreState>()((set, get) => ({
  workspaces: {},
  ...createNavigationSlice(set, get),
  ...createWorkspaceSlice(set),
  ...createTaskSlice(set),
  getWorkspaceState: (workspacePath: string, workspaceIdentity?: string) =>
    getWorkspaceState(get(), workspacePath, workspaceIdentity),
}));

type RobinRunSessionStoreE2EBridge = typeof useRobinRunSessionStore;

declare global {
  interface Window {
    __robinrunSessionStoreE2E?: RobinRunSessionStoreE2EBridge;
  }
}

if (shouldExposeE2EStoreBridge()) {
  // E2E 诊断入口必须由 WDIO 显式打开，不能复用 ROBINRUN_ENV=test，避免产品测试环境暴露可变全局 store。
  window.__robinrunSessionStoreE2E = useRobinRunSessionStore;
}

// ────────────────────────────────────────────
// Re-exports: 保持外部 `from '@/store/robinrunSessionStore'` 的导入路径继续工作
// ────────────────────────────────────────────
export * from "./robinrunSessionStoreTypes.js";
export * from "./robinrunSessionStoreSelectors.js";
// Re-export navigation types used externally:
export type {
  TaskNavigationHistory,
  TaskNavEntry,
  WorkspaceNavEntry,
} from "@/lib/taskNavigationHistory.js";

// 内存诊断计数器：workspace 桶全仓无删除路径，先落日志。
uiMemoryDiagnosticsRegistry.register("sessionStore", () => ({
  workspaces: Object.keys(useRobinRunSessionStore.getState().workspaces).length,
}));
