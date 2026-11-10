import { ServiceChannels } from "@robinrun/shared";
import type {
  TraceId,
  RobinRunAgentMcpServer,
  RobinRunDeliveryKind,
  RobinRunMessageWithParts,
  ModelSelection,
  RobinRunPermissionRequestParams,
  RobinRunProviderRuntimeHeadersRequestParams,
  RobinRunUserInputRequestParams,
  RobinRunUserInputResponse,
  RobinRunSessionInfo,
  RobinRunSessionImportHistory,
  RobinRunSessionEvent,
  RobinRunSessionMode,
  RobinRunSessionPersistence,
  RobinRunSessionStateSnapshot,
  RobinRunStateUpdatedNotification,
  RobinRunWorkspacePresentation,
} from "@robinrun/shared";
import { createServiceDescriptor } from "#src/descriptors.js";
import type { ProviderRuntimeHeadersUiResponse } from "#src/robinrun-agent/robinrunAgent.js";

export interface RobinRunSessionWorkspaceTarget {
  workspacePath: string;
  workspaceIdentity?: string;
  remoteSessionId?: string;
}

export type RobinRunSessionReadWorkspacePresentationParams = RobinRunSessionWorkspaceTarget;

export interface RobinRunTaskTarget extends RobinRunSessionWorkspaceTarget {
  sessionId: string;
}

export interface RobinRunSessionCreateParams extends RobinRunSessionWorkspaceTarget {
  /** 仅导入事务使用的预分配 ID；普通新会话继续由 Agent 分配。 */
  sessionId?: string;
  sessionTraceId?: TraceId;
  parentSessionId?: string;
  mode?: RobinRunSessionMode;
  model?: ModelSelection;
  persistence?: RobinRunSessionPersistence;
  thoughtLevel?: string;
  mcpServers?: RobinRunAgentMcpServer[];
  importedHistory?: RobinRunSessionImportHistory;
}

export interface RobinRunSessionResumeParams extends RobinRunTaskTarget {
  model?: ModelSelection;
  thoughtLevel?: string;
  mcpServers?: RobinRunAgentMcpServer[];
  /**
   * 默认广播 resume 得到的历史快照，并让 shadow 订阅请求初始 snapshot。
   * 续聊发送前的 runtime 预恢复会关闭它，避免旧终态快照覆盖本地已开始的新输入运行态。
   */
  broadcastSnapshot?: boolean;
}

export interface RobinRunSessionListParams extends RobinRunSessionWorkspaceTarget {
  limit?: number;
}

export interface RobinRunSessionReadParams extends RobinRunTaskTarget {
  deliveryKind?: RobinRunDeliveryKind;
  messageLimit?: number;
  afterSeq?: number;
}

export interface RobinRunSessionMessagesParams extends RobinRunTaskTarget {
  afterMessageId?: string;
  limit?: number;
}

export interface RobinRunSessionEventsParams extends RobinRunTaskTarget {
  afterSeq?: number;
  limit?: number;
}

export interface RobinRunSessionSetModelParams extends RobinRunTaskTarget {
  model: ModelSelection;
  expectedRevision?: number;
  persistAsWorkspaceLastUsed?: boolean;
}

export interface RobinRunSessionSetThoughtLevelParams extends RobinRunTaskTarget {
  thoughtLevel?: string;
  expectedRevision?: number;
  persistAsWorkspaceLastUsed?: boolean;
}

export interface RobinRunSessionSetModeParams extends RobinRunTaskTarget {
  mode: RobinRunSessionMode;
  expectedRevision?: number;
}

export interface RobinRunSessionRespondProviderRuntimeHeadersParams extends RobinRunTaskTarget {
  requestId: string;
  response: ProviderRuntimeHeadersUiResponse;
}

export interface RobinRunSessionSubscribeParams extends RobinRunTaskTarget {
  deliveryKind: RobinRunDeliveryKind;
  afterSeq?: number;
  includeSnapshot?: boolean;
  eventCoalescing?: {
    mode: "background-summary";
    intervalMs?: number;
  };
}

export type RobinRunSessionServiceEvent =
  | { type: "session.event"; event: RobinRunSessionEvent }
  | { type: "state.updated"; notification: RobinRunStateUpdatedNotification }
  | { type: "permission.request"; request: RobinRunPermissionRequestParams }
  | { type: "userInput.request"; request: RobinRunUserInputRequestParams }
  | {
      type: "userInput.response";
      requestId: string;
      response: RobinRunUserInputResponse;
    }
  | { type: "providerRuntimeHeaders.request"; request: RobinRunProviderRuntimeHeadersRequestParams }
  | { type: "snapshot"; snapshot: RobinRunSessionStateSnapshot };

export interface RobinRunSessionInitializeResult {
  available: boolean;
  workspaceKey: string;
  protocolName?: string;
  protocolVersion?: number;
  transportKind?: "stdio" | "websocket";
  reason?: string;
  reasonCode?: "provider_not_ready";
}

export interface RobinRunSessionWorkspaceRuntimeIdentity {
  generation: number;
  identity: string;
  processId?: number;
  workspaceKey: string;
}

export interface IRobinRunSessionService {
  initializeWorkspace(params: RobinRunSessionWorkspaceTarget): Promise<RobinRunSessionInitializeResult>;
  getWorkspaceRuntimeIdentity(
    params: RobinRunSessionWorkspaceTarget,
  ): Promise<RobinRunSessionWorkspaceRuntimeIdentity>;
  readWorkspacePresentation(
    params: RobinRunSessionReadWorkspacePresentationParams,
  ): Promise<RobinRunWorkspacePresentation>;
  createSession(params: RobinRunSessionCreateParams): Promise<RobinRunSessionStateSnapshot>;
  resumeSession(params: RobinRunSessionResumeParams): Promise<RobinRunSessionStateSnapshot>;
  listSessions(params: RobinRunSessionListParams): Promise<RobinRunSessionInfo[]>;
  readSession(params: RobinRunSessionReadParams): Promise<RobinRunSessionStateSnapshot>;
  readSessionMessages(params: RobinRunSessionMessagesParams): Promise<RobinRunMessageWithParts[]>;
  readSessionEvents(params: RobinRunSessionEventsParams): Promise<RobinRunSessionEvent[]>;
  promoteDeferredDraftSession(params: RobinRunTaskTarget): Promise<void>;
  closeSession(params: RobinRunTaskTarget): Promise<void>;
  closeDeferredDraftSession(params: RobinRunTaskTarget): Promise<boolean>;
  setModel(params: RobinRunSessionSetModelParams): Promise<RobinRunSessionStateSnapshot>;
  setThoughtLevel(params: RobinRunSessionSetThoughtLevelParams): Promise<RobinRunSessionStateSnapshot>;
  setMode(params: RobinRunSessionSetModeParams): Promise<RobinRunSessionStateSnapshot>;
  respondProviderRuntimeHeaders(
    params: RobinRunSessionRespondProviderRuntimeHeadersParams,
  ): Promise<void>;
  // M5 删波次 2：onDynamicSessionEvent（旧 session/subscribe 词表的 renderer 订阅面）
  // 已删除——v4 UI 走 agentService 的 conversation/sessions-index 帧通道，
  // 该方法在 renderer 侧已无任何调用者（grep packages/ui packages/desktop 为零）。
}

export const IRobinRunSessionService = createServiceDescriptor<IRobinRunSessionService>(
  ServiceChannels.RobinRunSession,
);
