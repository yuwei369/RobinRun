/**
 * RobinRun Agent Slash Commands 便捷 hook
 *
 * 返回当前 workspace 下 Agent 广播的可用 slash commands 列表。
 */
import { useRobinRunSessionStore, selectWorkspaceRobinRunState } from "../store/robinrunSessionStore.js";

export function useSlashCommands(workspacePath: string, workspaceIdentity?: string) {
  return useRobinRunSessionStore(
    (state) => selectWorkspaceRobinRunState(state, workspacePath, workspaceIdentity).slashCommands,
  );
}
