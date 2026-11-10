import type { RobinRunSessionStateSnapshot } from "@robinrun/shared";
import { createServiceLogger } from "#src/logger/serviceLogger.js";
import { repairImportedClaudeSessionSnapshot } from "#src/session/claude-native/importedClaudeHistoryRepair.js";
import type { IRobinRunAgentService } from "#src/robinrun-agent/robinrunAgent.js";
import type {
  RobinRunSessionReadParams,
  RobinRunSessionResumeParams,
} from "#src/robinrun-session/robinrunSession.js";

const logger = createServiceLogger("robinrun-session-service");

export async function repairEmptyImportedClaudeSessionSnapshot(params: {
  agentService: IRobinRunAgentService;
  snapshot: RobinRunSessionStateSnapshot;
  target: RobinRunSessionResumeParams | RobinRunSessionReadParams;
}): Promise<RobinRunSessionStateSnapshot> {
  const repaired = await repairImportedClaudeSessionSnapshot({
    snapshot: params.snapshot,
    target: {
      workspacePath: params.target.workspacePath,
      workspaceIdentity: params.target.workspaceIdentity,
      taskId: params.target.sessionId,
      ...("mcpServers" in params.target && params.target.mcpServers
        ? { mcpServers: params.target.mcpServers }
        : {}),
    },
    createSession: (input) => params.agentService.createSession(input),
    onRepair: (history) => {
      logger.warn(
        undefined,
        `[robinrun-session-service] Claude 导入 session 历史异常，按 ${history.source} 回填 taskId=${params.target.sessionId}`,
      );
    },
  });
  return repaired ?? params.snapshot;
}
