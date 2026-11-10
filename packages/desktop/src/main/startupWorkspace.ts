import { mkdir } from "node:fs/promises";
import type { WorkspacePurpose } from "@robinrun/shared";

interface StartupWorkspaceLogger {
  info?: (...args: unknown[]) => void;
  warn?: (...args: unknown[]) => void;
}

// 修复原因：会话 CLI 没有 idle 回收，启动预热 3 个会让每个窗口常驻 3 份 Agent 进程内存；
// 切到最近项目的冷启动收益抵不上常驻成本，收敛为只预热 active workspace。
// 与 @robinrun/protocol 的 init-local `agentWarmupTargets.max(1)` 保持一致。
export const STARTUP_AGENT_WARMUP_LIMIT = 1;

export interface StartupWorkspaceWarmupTarget {
  workspacePath: string;
  workspaceIdentity?: string;
}

export interface StartupWindowBootstrap {
  restoreSession?: boolean;
  initialWorkspacePath?: string;
  initialWorkspacePurpose?: WorkspacePurpose;
  unavailableWorkspacePath?: string;
  agentWarmupTargets?: StartupWorkspaceWarmupTarget[];
}

/** 显式打开路径（--open-workspace / deep link）走这里，绕过 launcher 直接进入项目。 */
export function createOpenWorkspaceStartupBootstrap(workspacePath: string): StartupWindowBootstrap {
  return {
    initialWorkspacePath: workspacePath,
    initialWorkspacePurpose: "project",
    agentWarmupTargets: [{ workspacePath }],
  };
}

export async function resolveStartupWindowBootstrap({
  conversationWorkspaceDir,
  logger,
}: {
  settingsFile: string;
  conversationWorkspaceDir: string;
  logger?: StartupWorkspaceLogger;
}): Promise<StartupWindowBootstrap> {
  // RobinRun：进入程序一律先经过项目启动台（launcher）选择/创建项目，不再自动恢复
  // 上次工作区，也不再把 conversation workspace 当作打开的工作区。restoreSession:false
  // 同时关掉 renderer 的 tab 恢复，保证冷启动一定停在启动台。
  // Agent 仍必须有真实 cwd 作为会话库 backing，因此保留 conversation workspace 目录创建。
  await mkdir(conversationWorkspaceDir, { recursive: true });
  logger?.info?.("[startup-workspace] launcher mode: skip startup workspace restore");
  return { restoreSession: false };
}
