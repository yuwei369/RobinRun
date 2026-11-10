import type { PluginUiToolResultNotification } from "@robinrun/shared/mcp-apps";
import type {
  BackgroundBashOutputResult,
  SessionDebugSnapshot,
  RobinRunSessionContentProfile,
} from "@robinrun/shared";
/* eslint-disable max-lines -- RobinRun agent service 接口集中声明 protocol/session/workspace 方法，拆分会增加 service descriptor 迁移成本。 */
import type { RemoteConversationTelemetryEvent } from "@robinrun/shared/conversation-telemetry";
import type { Event, IDisposable } from "@robinrun/rpc";
import { ServiceChannels } from "@robinrun/shared";
import type { AppUsageRange, AppUsageSnapshot, RobinRunTaskTokenUsageResult } from "@robinrun/shared";
import type { DynamicWorkflowMode } from "@robinrun/shared";
import type { RobinRunAutomation, RobinRunAutomationRun } from "@robinrun/shared";
import type {
  RobinRunStorageStartupState,
  RobinRunDeliveryKind,
  RobinRunAgentMcpServer,
  RobinRunBackgroundTurnAttribution,
  TraceId,
  RobinRunSessionCompactResult,
  RobinRunSessionGoalAction,
  RobinRunSessionGoalResult,
  RobinRunMessageWithParts,
  ModelSelection,
  RobinRunSessionImportHistory,
  RobinRunPermissionRequestParams,
  AgentLaneResourceSample,
  RobinRunMcpTelemetryEvent,
  RobinRunMcpResourceSample,
  RobinRunToolExecResource,
  RobinRunProcessChildProcess,
  RobinRunMcpListResult,
  WorkspaceMcpTrustDecision,
  RobinRunWorkspaceMcpTrustResult,
  RobinRunPluginsListResult,
  RobinRunPluginsOverviewResult,
  RobinRunPluginsMarketplaceMutationResult,
  RobinRunPluginsInstallResult,
  RobinRunPluginsReferenceCatalogResult,
  RobinRunSkillsReferenceCatalogResult,
  RobinRunMcpReadResourceResult,
  RobinRunMcpUiCallToolResult,
  RobinRunMcpUiCancelCallResult,
  RobinRunMcpUiReadResourceResult,
  RobinRunMcpUiListResourcesResult,
  RobinRunMcpUiAppToolAcceptedResult,
  RobinRunMcpUiRegisterAppToolsResult,
  RobinRunMcpUiUnregisterAppToolsResult,
  RobinRunMcpUiListResourceTemplatesResult,
  RobinRunPluginsListUiSurfacesResult,
  RobinRunWorkflowsDeleteResult,
  RobinRunWorkflowsForRunResult,
  RobinRunWorkflowsGetResult,
  RobinRunWorkflowsListResult,
  RobinRunWorkflowsMoveResult,
  RobinRunWorkflowsRunsResult,
  RobinRunWorkflowsSaveResult,
  RobinRunWorkflowsUpdateMetaResult,
  RobinRunPluginsUninstallResult,
  RobinRunPluginsRestoreBuiltinResult,
  RobinRunPluginsConfigureResult,
  RobinRunPluginsDescribeResult,
  RobinRunPluginsValidateResult,
  RobinRunPluginsSetEnabledResult,
  RobinRunPluginsCancelOperationResult,
  RobinRunPluginOperationProgressNotification,
  RobinRunProviderRuntimeHeadersRequestParams,
  RequestVerificationConfig,
  RobinRunProviderRuntimeHeadersCancelled,
  RobinRunProviderTestModelConnectivityParams,
  RobinRunProviderTestModelConnectivityResult,
  RobinRunUserInputRequestParams,
  RobinRunUserInputResponse,
  RobinRunSessionEvent,
  RobinRunSessionInfo,
  RobinRunSessionMode,
  RobinRunSessionPersistence,
  RobinRunSessionSendResult,
  RobinRunSessionRequestRuntimePreferencesParams,
  RobinRunSessionRuntimePreferencesResult,
  RobinRunSessionStateSnapshot,
  RobinRunSessionSubagentsResult,
  RobinRunStateUpdatedNotification,
  RobinRunTaskClientMode,
  RobinRunBrowserAmbientContext,
  RobinRunWorkspacePresentation,
  RobinRunWorkspaceGenerateTextResult,
  RobinRunWorkspaceGenerateTextParams,
  RobinRunWorkspaceHookTrustGrantResult,
  RobinRunAutomationBotDeliveryTarget,
} from "@robinrun/shared";
import type {
  ClientHello,
  CommandAck,
  CommandEnvelope,
  CommandKey,
  CommandsQueryResult,
  ConversationTopicWireCandidate,
  ConversationTelemetryFact,
  CuaPermissionObservation,
  ConversationRowTarget,
  HelloMessage,
  SessionsIndexTopicWireCandidate,
  SessionsIndexReconcileResult,
  V4AttachmentBeginResult,
  V4AttachmentChunkResult,
  V4AttachmentCommitResult,
  V4AttachmentPreviewSourceResult,
  V4AttachmentReadResult,
  V4ConversationAttachmentReadResult,
  V4ConversationAttachmentStatResult,
  V4ConnectionFlowState,
  V4ConversationFileChangesResult,
  V4ConversationFileRewindPreviewResult,
  V4ConversationInputPredictionResult,
  V4ConversationPlansResult,
  V4ConversationWorkflowRunEventsResult,
  V4ConversationWorkflowRunArtifactDataResult,
  V4ConversationWorkflowRunArtifactReadResult,
  V4ConversationWorkflowRunArtifactsResult,
  V4ConversationWorkflowRunNodeResultResult,
  V4ConversationWorkflowRunWorkspaceResult,
  V4ConversationWorkflowRunsResult,
  V4ConversationRowsRangeResult,
  V4ConversationResyncResult,
  V4ConversationSubscribeResult,
  V4SessionsIndexSubscribeResult,
  V4WorkspaceConfigSubscribeResult,
  WorkspaceConfigTopicWireCandidate,
} from "@robinrun/shared/robinrun-protocol-v4";
import type {
  V4SessionDataMeasureResult,
  V4SessionDataParams,
  V4SessionDataPurgeResult,
} from "@robinrun/shared/robinrun-protocol-v4";
import { createServiceDescriptor } from "../descriptors.js";

export * from "./robinrunAgentPluginParams.js";
export * from "./robinrunAgentWorkflowParams.js";
import type {
  RobinRunAgentAddPluginMarketplaceParams,
  RobinRunAgentAutomationIdParams,
  RobinRunAgentCancelPluginOperationParams,
  RobinRunAgentConfigurePluginParams,
  RobinRunAgentResetPluginConfigParams,
  RobinRunAgentCreateAutomationParams,
  RobinRunAgentDeleteAutomationRunParams,
  RobinRunAgentDescribePluginParams,
  RobinRunAgentInstallPluginParams,
  RobinRunAgentListMcpServerStatusesParams,
  RobinRunAgentPluginViewParams,
  RobinRunAgentPluginReferenceCatalogParams,
  RobinRunAgentSkillReferenceCatalogParams,
  RobinRunAgentReadMcpResourceParams,
  RobinRunAgentReadMcpResourceForUiParams,
  RobinRunAgentListMcpResourcesForUiParams,
  RobinRunAgentAppToolCallForUiParams,
  RobinRunAgentAppToolInstanceForUiParams,
  RobinRunAgentRegisterAppToolsForUiParams,
  RobinRunAgentResolveAppToolCallForUiParams,
  RobinRunAgentMcpResourceSubscriptionForUiParams,
  RobinRunAgentCallMcpToolForUiParams,
  RobinRunAgentCancelMcpToolCallForUiParams,
  RobinRunAgentResolveSuggestedPluginReferenceParams,
  RobinRunAgentRemovePluginMarketplaceParams,
  RobinRunAgentRestoreBuiltinPluginParams,
  RobinRunAgentSetPluginEnabledParams,
  RobinRunAgentSetAutomationEnabledParams,
  RobinRunAgentUninstallPluginParams,
  RobinRunAgentUpdatePluginMarketplaceParams,
  RobinRunAgentUpdatePluginParams,
  RobinRunAgentUpdateAutomationParams,
  RobinRunAgentValidatePluginParams,
  RobinRunAgentWorkspaceTarget,
} from "./robinrunAgentPluginParams.js";
import type {
  RobinRunAgentDeleteSavedWorkflowParams,
  RobinRunAgentFindSavedWorkflowForRunParams,
  RobinRunAgentGetSavedWorkflowParams,
  RobinRunAgentListSavedWorkflowRunsParams,
  RobinRunAgentListSavedWorkflowsParams,
  RobinRunAgentMoveSavedWorkflowParams,
  RobinRunAgentSaveSavedWorkflowFromRunParams,
  RobinRunAgentUpdateSavedWorkflowMetaParams,
} from "./robinrunAgentWorkflowParams.js";

export interface RobinRunAgentSessionTarget extends RobinRunAgentWorkspaceTarget {
  sessionId: string;
}

export interface RobinRunAgentResumeSessionParams extends RobinRunAgentSessionTarget {
  additionalDirectories?: string[];
  model?: ModelSelection;
  thoughtLevel?: string;
  mcpServers?: RobinRunAgentMcpServer[];
  // 冷恢复会重建 runtime，工具面隔离必须和 create 保持同一安全边界（CUA 只放行 robinrun-cua 工具、
  // 禁 Bash 等）。否则 resume 后模型可见工具面/执行权限会比创建时更宽。
  toolAllowlist?: string[];
  toolDenylist?: string[];
}

export interface RobinRunAgentInitializeResult {
  available: boolean;
  workspaceKey: string;
  protocolName?: string;
  protocolVersion?: number;
  transportKind?: "stdio" | "websocket";
  reason?: string;
  reasonCode?: "provider_not_ready";
}

export interface RobinRunAgentRunAutomationNowResult {
  status: "queued" | "duplicate";
}

export interface RobinRunAgentWorkspaceRuntimeIdentity {
  generation: number;
  identity: string;
  processId?: number;
  workspaceKey: string;
}

export const ROBINRUN_AGENT_RUNTIME_UNAVAILABLE_CODE = "ROBINRUN_AGENT_RUNTIME_UNAVAILABLE";

export type RobinRunAgentRuntimePolicy = "start-if-needed" | "existing-only";

export interface RobinRunAgentRuntimeLifecycleEvent extends RobinRunAgentWorkspaceTarget {
  workspaceKey: string;
  runtimeIdentity: RobinRunAgentWorkspaceRuntimeIdentity;
  state: "available" | "unavailable";
}

export type RobinRunAgentCuaPermissionObservation = CuaPermissionObservation &
  RobinRunAgentWorkspaceTarget;

export interface RobinRunAgentCreateSessionParams extends RobinRunAgentWorkspaceTarget {
  projectId?: string | null;
  additionalDirectories?: string[];
  sessionId?: string;
  sessionTraceId?: TraceId;
  parentSessionId?: string;
  mode?: RobinRunSessionMode;
  model?: ModelSelection;
  persistence?: RobinRunSessionPersistence;
  thoughtLevel?: string;
  /** automation 执行会话关闭模型二次命名，保持首条用户 query 作为稳定标题。 */
  titleGenerationEnabled?: boolean;
  mcpServers?: RobinRunAgentMcpServer[];
  toolAllowlist?: string[];
  toolDenylist?: string[];
  importedHistory?: RobinRunSessionImportHistory;
}

export interface RobinRunAgentListSessionsParams extends RobinRunAgentWorkspaceTarget {
  sessionIds?: string[];
  runtimePolicy?: RobinRunAgentRuntimePolicy;
  limit?: number;
}

export interface RobinRunAgentListSessionSubagentsParams extends RobinRunAgentSessionTarget {
  endedCursor?: string;
  endedLimit?: number;
  /** 远程 workspace 的宿主连接身份；只用于选择现有 Host，不进入 CLI wire query。 */
  remoteSessionId?: string;
}

export interface RobinRunAgentAppUsageParams {
  range: AppUsageRange;
  timeZone?: string;
}

export interface RobinRunAgentTaskTokenUsageParams extends RobinRunAgentSessionTarget {}

export interface RobinRunAgentReadSessionParams extends RobinRunAgentSessionTarget {
  deliveryKind?: RobinRunDeliveryKind;
  messageLimit?: number;
  afterSeq?: number;
  /** 被动索引/观察者只能读取现有 runtime，禁止为了读快照拉起 session。 */
  runtimePolicy?: RobinRunAgentRuntimePolicy;
  /** "index" 仅供 task index：返回剥离大载荷的同结构 snapshot，禁止回写 UI 状态。 */
  contentProfile?: RobinRunSessionContentProfile;
}

export interface RobinRunAgentReadSessionMessagesParams extends RobinRunAgentSessionTarget {
  afterMessageId?: string;
  limit?: number;
}

export interface RobinRunAgentReadSessionEventsParams extends RobinRunAgentSessionTarget {
  afterSeq?: number;
  limit?: number;
}

export type RobinRunAgentReadWorkspacePresentationParams = RobinRunAgentWorkspaceTarget;

export interface RobinRunAgentGrantWorkspaceHookTrustParams extends RobinRunAgentWorkspaceTarget {
  bundleDigest: string;
  hookDeclarationDigest: string;
}

export interface RobinRunAgentSendPromptParamsBase extends RobinRunAgentSessionTarget {
  modelSelection?: ModelSelection;
  modelExecution?: import("@robinrun/shared/robinrun-protocol-v4").CommandPayloadMap["sendText"]["modelExecution"];
  inputId?: string;
  queryId?: string;
  messageId?: string;
  sessionTraceId?: TraceId;
  content: string;
  attachments?: Record<string, unknown>[];
  /** provider-only 的当前 IAB 状态；UI/session persistence 仍使用 content 原文。 */
  browserAmbientContext?: RobinRunBrowserAmbientContext;
  clientMode?: RobinRunTaskClientMode;
  expectedRevision?: number;
  expectedProviderRevision?: string;
  runtimeProviderHeaders?: Record<string, string>;
  toolDenylist?: string[];
  /** Bot 来源 turn 的稳定回推地址；只在当前 turn 内供 CronCreate 读取。 */
  botDeliveryTarget?: RobinRunAutomationBotDeliveryTarget;
}

export type RobinRunAgentSendPromptParams = RobinRunAgentSendPromptParamsBase &
  RobinRunBackgroundTurnAttribution;

export interface RobinRunAgentCompactParams extends RobinRunAgentSessionTarget {
  inputId?: string;
  instructions?: string;
  expectedRevision?: number;
}

export interface RobinRunAgentGoalParams extends RobinRunAgentSessionTarget {
  inputId?: string;
  action: RobinRunSessionGoalAction;
  objective?: string;
  expectedRevision?: number;
}

export interface RobinRunAgentSetModelParams extends RobinRunAgentSessionTarget {
  model: ModelSelection;
  expectedRevision?: number;
  persistAsWorkspaceLastUsed?: boolean;
}

export interface RobinRunAgentSetThoughtLevelParams extends RobinRunAgentSessionTarget {
  thoughtLevel?: string;
  expectedRevision?: number;
  persistAsWorkspaceLastUsed?: boolean;
}

export interface RobinRunAgentSetModeParams extends RobinRunAgentSessionTarget {
  mode: RobinRunSessionMode;
  expectedRevision?: number;
}

export interface RobinRunAgentGenerateWorkspaceTextParams extends RobinRunAgentWorkspaceTarget {
  selection: RobinRunWorkspaceGenerateTextParams["selection"];
  prompt?: string;
  messages?: RobinRunWorkspaceGenerateTextParams["messages"];
  tools?: RobinRunWorkspaceGenerateTextParams["tools"];
  querySource: string;
  maxOutputTokens?: number;
  signal?: AbortSignal;
  /**
   * 协议层 RPC 超时。thinking 模型的长请求会超过协议 client 默认的
   * 3 分钟；调用方必须把自身 deadline 透传到这里，否则默认超时先触发、
   * 还会被 onRequestTimeout 误判 stale 杀进程。
   */
  requestTimeoutMs?: number;
}

export interface RobinRunAgentTestModelConnectivityParams extends RobinRunAgentWorkspaceTarget {
  selection: RobinRunProviderTestModelConnectivityParams["selection"];
  signal?: AbortSignal;
}

// 合并时曾混用 Agent 完整鉴权响应；UI 只能回传请求校验，账号鉴权必须由 Host 合成。
export type ProviderRuntimeHeadersUiResponse =
  | { headersApplied: true; runtimeProviderHeaders: Record<string, string>; errorMessage?: string }
  | { headersApplied: false; errorMessage?: string };

export interface RobinRunAgentRespondProviderRuntimeHeadersParams extends RobinRunAgentSessionTarget {
  requestId: string;
  response: ProviderRuntimeHeadersUiResponse;
}

export interface RobinRunAgentSessionRuntimePreferencesRequest extends RobinRunSessionRequestRuntimePreferencesParams {
  requestId: string;
}

export interface RobinRunAgentRespondSessionRuntimePreferencesParams {
  requestId: string;
  resolution:
    | { status: "resolved"; preferences: RobinRunSessionRuntimePreferencesResult }
    | { status: "failed"; message: string };
}

export interface RobinRunAgentSessionSubscribeParams extends RobinRunAgentSessionTarget {
  deliveryKind: RobinRunDeliveryKind;
  afterSeq?: number;
  includeSnapshot?: boolean;
  eventCoalescing?: {
    mode: "background-summary";
    intervalMs?: number;
  };
}

// ── v4 conversation 通道（竖切）──
// host 只做转发：subscribe/unsubscribe/command 透传给 CLI v4 gateway，
// v4/conversation/frame 通知按 workspace fan-out 给 renderer。

export interface RobinRunAgentConversationSubscribeParams extends RobinRunAgentSessionTarget {
  retryInitialization?: string;
  /** 水位不变量：仅当客户端真持有该时刻一致状态才允许带。 */
  base?: { logEpoch: string; seq: number };
  visibility?: "foreground" | "background";
}

export interface RobinRunAgentConversationUnsubscribeParams extends RobinRunAgentWorkspaceTarget {
  subscriptionId: string;
  runtimePolicy?: RobinRunAgentRuntimePolicy;
}

export interface RobinRunAgentConversationResyncParams extends RobinRunAgentWorkspaceTarget {
  subscriptionId: string;
  base: { logEpoch: string; seq: number } | null;
  forceSnapshot?: boolean;
  runtimePolicy?: RobinRunAgentRuntimePolicy;
}

/** 行分页 query（rows/range）：按游标向上取一窗历史行。 */
export interface RobinRunAgentConversationRowsRangeParams extends RobinRunAgentSessionTarget {
  /** 取 rowId < beforeRowId 的行；缺省 = 从当前尾部向前。 */
  beforeRowId?: number;
  /** 1..rowsRangeMaxLimit（200）。 */
  limit: number;
  /**
   * 手机预加载：只读热会话。工作区 CLI 未运行、执行端不支持、会话不在内存都报
   * proto.sessionNotResident，不拉起进程、不冷恢复。
   */
  residency?: "resident-only";
}

/** 当前有效分支里的终态 ExitPlanMode 目录。 */
export type RobinRunAgentConversationPlansParams = RobinRunAgentSessionTarget;

/** 手机远控输入预测（ghost hint）；线格式见 docs/web-remote-control/mobile-input-prediction.md。 */
export interface RobinRunAgentConversationInputPredictionParams extends RobinRunAgentSessionTarget {
  /** 手机当前看到的会话 revision；参与 CLI 侧缓存键，回包据此丢弃过期结果。 */
  revision: number;
  /** 当前草稿；缺省/空 = 预测下一条输入，非空 = 续写草稿。 */
  draft?: string;
  /** 手机侧请求 id，原样回声，用于丢弃过期回包。 */
  requestId?: string;
}

/** workflow run 的事件日志分页（详情页审计面）；cursor = journal sequence。 */
export interface RobinRunAgentConversationWorkflowRunEventsParams extends RobinRunAgentSessionTarget {
  runId: string;
  afterSequence?: number;
  limit?: number;
}

/** dwf run 的枚举（重启后的发现查询）。 */
export interface RobinRunAgentConversationWorkflowRunsParams extends RobinRunAgentSessionTarget {
  limit?: number;
}

// ── dwf 用户面产物──
// ⚠ 术语：artifact = 脚本经 `artifact.*` 发布给**用户**看的产出（文件 / markdown / 预置看板），
// 不是 run 的顶层返回值（引擎内部对后者的同名叫法）。

/** 产物清单；UI 冷恢复与中枢详情的 durable 读法。 */
export interface RobinRunAgentConversationWorkflowRunArtifactsParams extends RobinRunAgentSessionTarget {
  runId: string;
}

/** 预置看板的取数面；cursor = journal sequence（严格大于）。 */
export interface RobinRunAgentConversationWorkflowRunArtifactDataParams extends RobinRunAgentSessionTarget {
  runId: string;
  artifactId: string;
  afterSequence?: number;
  limit?: number;
}

/** 内容产物的字节，一次一块（≤ 512 KiB，形状逐字照 attachmentRead）。 */
export interface RobinRunAgentConversationWorkflowRunArtifactReadParams extends RobinRunAgentSessionTarget {
  runId: string;
  artifactId: string;
  version: number;
  offset: number;
  limit: number;
}

// ── dwf 工作区 transcript──
/** 轻行清单：一个 run 的 files.* / git.* / world.run 行，不带正文。 */
export interface RobinRunAgentConversationWorkflowRunWorkspaceParams extends RobinRunAgentSessionTarget {
  runId: string;
}

/** 一个工作区节点的正文，按 maxBytes 保形有界化（缺省与上限在 CLI 网关侧）。 */
export interface RobinRunAgentConversationWorkflowRunNodeResultParams extends RobinRunAgentSessionTarget {
  runId: string;
  siteId: string;
  ordinal: number;
  maxBytes?: number;
}

export interface RobinRunAgentBackgroundBashOutputParams extends RobinRunAgentSessionTarget {
  workId: string;
}

export interface RobinRunAgentConversationFileChangesParams extends RobinRunAgentSessionTarget {
  target: ConversationRowTarget;
  baseRevision: number;
  baseLogEpoch: string;
}

export interface RobinRunAgentConversationFileRewindPreviewParams extends RobinRunAgentSessionTarget {
  target: ConversationRowTarget;
  baseRevision: number;
  baseLogEpoch: string;
}

export interface RobinRunAgentConversationCommandParams extends RobinRunAgentWorkspaceTarget {
  /** 仅 Host 消费；显式 NULL 表示全局任务，不向 CLI 发送项目概念。 */
  projectId?: string | null;
  envelope: CommandEnvelope;
  /** 仅 host 内部用于 Browser Use runtime 边界，不进入 v4 wire envelope。 */
  clientMode?: RobinRunTaskClientMode;
}

export interface RobinRunAgentCommandsQueryParams extends RobinRunAgentWorkspaceTarget {
  clock?: true;
  commands: CommandKey[];
}

/** UI 不携带 connectionId；connection scope 以 trusted carrier 注入 wire identity。 */
export interface RobinRunAgentAttachmentBeginParams extends RobinRunAgentSessionTarget {
  uploadId: string;
  fileName: string;
  mime: string;
  totalBytes: number;
  totalChunks: number;
  checksum: string;
}

export interface RobinRunAgentAttachmentChunkParams extends RobinRunAgentSessionTarget {
  uploadId: string;
  chunkIndex: number;
  dataBase64: string;
}

export interface RobinRunAgentAttachmentTerminalParams extends RobinRunAgentSessionTarget {
  uploadId: string;
}

export interface RobinRunAgentAttachmentReadParams extends RobinRunAgentSessionTarget {
  ref: string;
  target?: ConversationRowTarget;
  attachmentIndex?: number;
  offset: number;
  limit: number;
}

export interface RobinRunAgentConversationAttachmentReadParams extends RobinRunAgentSessionTarget {
  ref: string;
  target: ConversationRowTarget;
  attachmentIndex: number;
  offset: number;
  limit: number;
}

export interface RobinRunAgentConversationAttachmentStatParams extends RobinRunAgentSessionTarget {
  ref: string;
  target: ConversationRowTarget;
  attachmentIndex: number;
}

export interface RobinRunAgentAttachmentPreviewSourceParams extends RobinRunAgentSessionTarget {
  ref: string;
  target?: ConversationRowTarget;
  attachmentIndex?: number;
}

/** host scope 内部 transport 控制面；connectionId 只能经 trusted carrier 注入。 */
export interface RobinRunAgentConnectionFlowParams extends RobinRunAgentWorkspaceTarget {
  state: V4ConnectionFlowState;
}

/** sessions-index：workspace 级列表订阅（无 sessionId 维度）。 */
export interface RobinRunAgentSessionsIndexSubscribeParams extends RobinRunAgentWorkspaceTarget {
  base?: { logEpoch: string; seq: number };
  visibility?: "foreground" | "background";
  /**
   * 订阅者作用域后缀：CLI 侧重订阅替换按 (connectionId, topic) 判定，
   * host 进程内多个独立消费者（renderer 侧栏 / task-index syncer）订阅同一 topic 时
   * 必须用不同 connectionId，否则互相替换对方的订阅代际。缺省共享 host 连接 id。
   */
  subscriberScope?: string;
  /**
   * task-list 等被动观察者必须使用 existing-only；runtime 不存在时返回稳定 unavailable，
   * 禁止为了建立列表订阅而启动 Agent。缺省保持显式会话入口的旧行为。
   */
  runtimePolicy?: RobinRunAgentRuntimePolicy;
}

/** workspace-config：workspace 级配置目录订阅（config options + slash 目录）。 */
export interface RobinRunAgentWorkspaceConfigSubscribeParams extends RobinRunAgentWorkspaceTarget {
  base?: { logEpoch: string; seq: number };
  visibility?: "foreground" | "background";
  subscriberScope?: string;
  runtimePolicy?: RobinRunAgentRuntimePolicy;
}

/** Host 为 App 应答方绑定的本次配置；不扩展 Agent wire 协议。 */
export type RobinRunAgentProviderRuntimeHeadersRequest = RobinRunProviderRuntimeHeadersRequestParams & {
  requestVerificationConfig?: RequestVerificationConfig;
};

export type RobinRunAgentServiceEvent =
  | { type: "session.event"; event: RobinRunSessionEvent }
  | { type: "state.updated"; notification: RobinRunStateUpdatedNotification }
  | { type: "permission.request"; request: RobinRunPermissionRequestParams }
  | { type: "userInput.request"; request: RobinRunUserInputRequestParams }
  | {
      type: "userInput.response";
      requestId: string;
      response: RobinRunUserInputResponse;
    }
  | { type: "providerRuntimeHeaders.request"; request: RobinRunAgentProviderRuntimeHeadersRequest }
  | { type: "snapshot"; snapshot: RobinRunSessionStateSnapshot };

export interface RobinRunAgentAppRuntimePreferences {
  askUserQuestionAutoResolutionEnabled: boolean;
  modelIoFullRetentionEnabled?: boolean;
}

export interface RobinRunAgentLocalRuntimeChildProcesses {
  pid: number;
  provider: string;
  workspacePath: string;
  lane?: string;
  children: RobinRunProcessChildProcess[];
}

export interface RobinRunAgentStorageStartupSnapshot {
  generation: number;
  state: RobinRunStorageStartupState | null;
}

export interface IRobinRunAgentService {
  /** 控制面不需要账号或模型，且不发送普通协议请求。 */
  prepareStorage(params: RobinRunAgentWorkspaceTarget): Promise<void>;
  getStorageStartupState(
    params: RobinRunAgentWorkspaceTarget,
  ): Promise<RobinRunAgentStorageStartupSnapshot | null>;
  onDynamicStorageStartupState(
    params: RobinRunAgentWorkspaceTarget,
  ): Event<RobinRunAgentStorageStartupSnapshot>;
  initialize(params: RobinRunAgentWorkspaceTarget): Promise<RobinRunAgentInitializeResult>;
  /**
   * 同步 App 全局运行时偏好到所有已活动 workspace；不得为此启动空闲 Agent。
   */
  syncAppRuntimePreferences(preferences: RobinRunAgentAppRuntimePreferences): Promise<void>;
  /**
   * 动态工作流用户选择变化的信号（docs/dynamic-workflow/launch.md「The user's choice」）：Host 重新计算
   * 生效模式并串行重发 workspace/updateDynamicWorkflowPolicy。有本机设置权威的 Host 以设置文件为准；
   * desktop-attached remote Host 以传入值为准（缺席 = 跟随服务端）。不得为此启动空闲 Agent。
   */
  syncDynamicWorkflowUserMode(params: { mode?: DynamicWorkflowMode }): Promise<void>;
  getWorkspaceRuntimeIdentity(
    params: RobinRunAgentWorkspaceTarget,
  ): Promise<RobinRunAgentWorkspaceRuntimeIdentity>;
  createSession(params: RobinRunAgentCreateSessionParams): Promise<RobinRunSessionStateSnapshot>;
  resumeSession(params: RobinRunAgentResumeSessionParams): Promise<RobinRunSessionStateSnapshot>;
  listSessions(params: RobinRunAgentListSessionsParams): Promise<RobinRunSessionInfo[]>;
  listSessionSubagents(
    params: RobinRunAgentListSessionSubagentsParams,
  ): Promise<RobinRunSessionSubagentsResult>;
  getAppUsageStats(params: RobinRunAgentAppUsageParams): Promise<AppUsageSnapshot>;
  /** 项目数据删除前的测量：只读，用本机已有 runtime 或管理面进程，不为某个项目拉起 Agent。 */
  measureSessionData?(params: V4SessionDataParams): Promise<V4SessionDataMeasureResult>;
  /**
   * 彻底删除会话与目录记忆。workspace 已有 Agent 进程时交给它（它持有会话运行态，能判断运行中
   * 并释放已加载会话）；否则交给管理面进程。只用于本机。
   */
  purgeSessionData?(
    params: V4SessionDataParams & { workspace: RobinRunAgentWorkspaceTarget },
  ): Promise<V4SessionDataPurgeResult>;
  getTaskTokenUsage(params: RobinRunAgentTaskTokenUsageParams): Promise<RobinRunTaskTokenUsageResult>;
  readSession(params: RobinRunAgentReadSessionParams): Promise<RobinRunSessionStateSnapshot>;
  readSessionMessages(
    params: RobinRunAgentReadSessionMessagesParams,
  ): Promise<RobinRunMessageWithParts[]>;
  readSessionDebug(params: RobinRunAgentSessionTarget): Promise<SessionDebugSnapshot>;
  readSessionEvents(params: RobinRunAgentReadSessionEventsParams): Promise<RobinRunSessionEvent[]>;
  readWorkspacePresentation(
    params: RobinRunAgentReadWorkspacePresentationParams,
  ): Promise<RobinRunWorkspacePresentation>;
  /** 无 task/session 的 Settings 预信任；Agent 会重新发现并校验 canonical snapshot。 */
  grantWorkspaceHookTrust(
    params: RobinRunAgentGrantWorkspaceHookTrustParams,
  ): Promise<RobinRunWorkspaceHookTrustGrantResult>;
  setWorkspaceMcpTrust(params: WorkspaceMcpTrustDecision): Promise<RobinRunWorkspaceMcpTrustResult>;
  listMcpServerStatuses(params: RobinRunAgentListMcpServerStatusesParams): Promise<RobinRunMcpListResult>;
  listPlugins(params: RobinRunAgentPluginViewParams): Promise<RobinRunPluginsListResult>;
  /**
   * Plugin 对话引用 catalog：session-scoped 只读投影。
   * 走 workspace 级 agent client（session 记录只存在于该进程），不走独立插件管理进程。
   */
  getPluginReferenceCatalog(
    params: RobinRunAgentPluginReferenceCatalogParams,
  ): Promise<RobinRunPluginsReferenceCatalogResult>;
  /** Composer Skill 引用 catalog；带 sessionId 时读取该 runtime 的冻结快照。 */
  getSkillReferenceCatalog(
    params: RobinRunAgentSkillReferenceCatalogParams,
  ): Promise<RobinRunSkillsReferenceCatalogResult>;
  /** 插件 UI：读取插件 MCP 的 `ui://` 资源；走 session 所在 workspace agent 进程。 */
  openMcpUiInstance(
    params: import("../plugin-ui-bridge/contract.js").PluginUiPrepareSandboxParams & {
      accountContext?: string;
    },
  ): Promise<import("@robinrun/shared/mcp-apps").McpAppInstance>;
  validateMcpUiInstance(
    params: import("../plugin-ui-bridge/contract.js").PluginUiPluginScope,
  ): Promise<void>;
  recycleMcpUiInstance(
    params: import("../plugin-ui-bridge/contract.js").PluginUiPluginScope,
  ): Promise<boolean>;
  closeMcpUiInstance(
    params: import("../plugin-ui-bridge/contract.js").PluginUiPluginScope,
  ): Promise<void>;
  readMcpResource(params: RobinRunAgentReadMcpResourceParams): Promise<RobinRunMcpReadResourceResult>;
  /** 插件 UI：UI 发起的工具调用；复用既有权限审批，不产生 transcript row。 */
  sampleMcpApp(
    params: import("../plugin-ui-bridge/samplingContract.js").PluginUiSamplingParams,
  ): Promise<import("@robinrun/shared/mcp-apps").McpAppsSamplingResult>;
  cancelMcpAppSampling(
    params: import("../plugin-ui-bridge/samplingContract.js").PluginUiCancelSamplingParams,
  ): Promise<{ cancelled: boolean }>;
  callMcpToolForUi(params: RobinRunAgentCallMcpToolForUiParams): Promise<RobinRunMcpUiCallToolResult>;
  /** 插件 UI 取消带 callId 的进行中 UI 工具调用；agent 侧 abort 到 MCP client。 */
  cancelMcpToolCallForUi(
    params: RobinRunAgentCancelMcpToolCallForUiParams,
  ): Promise<RobinRunMcpUiCancelCallResult>;
  /** 插件 UI 页面发起的 `resources/read`，agent 侧限同插件服务器、8 MiB、mimeType 白名单。 */
  readMcpResourceForUi(
    params: RobinRunAgentReadMcpResourceForUiParams,
  ): Promise<RobinRunMcpUiReadResourceResult>;
  /** 插件 UI 页面发起的 resources/list、resources/templates/list、subscribe、unsubscribe 代理。 */
  listMcpResourcesForUi(
    params: RobinRunAgentListMcpResourcesForUiParams,
  ): Promise<RobinRunMcpUiListResourcesResult>;
  listMcpResourceTemplatesForUi(
    params: RobinRunAgentListMcpResourcesForUiParams,
  ): Promise<RobinRunMcpUiListResourceTemplatesResult>;
  subscribeMcpResourceForUi(params: RobinRunAgentMcpResourceSubscriptionForUiParams): Promise<void>;
  unsubscribeMcpResourceForUi(params: RobinRunAgentMcpResourceSubscriptionForUiParams): Promise<void>;
  /** App-Provided Tools：页面工具登记 / 注销与模型调用的认领 / 回传（信箱投递走 v4 live 增量）。 */
  registerAppToolsForUi(
    params: RobinRunAgentRegisterAppToolsForUiParams,
  ): Promise<RobinRunMcpUiRegisterAppToolsResult>;
  unregisterAppToolsForUi(
    params: RobinRunAgentAppToolInstanceForUiParams,
  ): Promise<RobinRunMcpUiUnregisterAppToolsResult>;
  claimAppToolCallForUi(
    params: RobinRunAgentAppToolCallForUiParams,
  ): Promise<RobinRunMcpUiAppToolAcceptedResult>;
  resolveAppToolCallForUi(
    params: RobinRunAgentResolveAppToolCallForUiParams,
  ): Promise<RobinRunMcpUiAppToolAcceptedResult>;
  /** 插件 UI 工作区级面板入口（已启用插件清单 `ui.surfaces[]`）。 */
  listPluginUiSurfaces(
    params: RobinRunAgentWorkspaceTarget,
  ): Promise<RobinRunPluginsListUiSurfacesResult>;
  // 已保存工作流的 GUI 中枢：workspace 级、无会话，每次调用现扫 `<cwd>/.robinrun/workflows/`。
  // 全局档传 `scope: "global"`：带 workspace 就用它当载体，不带则由 services 层自选本机载体运行时。
  listSavedWorkflows(params: RobinRunAgentListSavedWorkflowsParams): Promise<RobinRunWorkflowsListResult>;
  getSavedWorkflow(params: RobinRunAgentGetSavedWorkflowParams): Promise<RobinRunWorkflowsGetResult>;
  updateSavedWorkflowMeta(
    params: RobinRunAgentUpdateSavedWorkflowMetaParams,
  ): Promise<RobinRunWorkflowsUpdateMetaResult>;
  deleteSavedWorkflow(
    params: RobinRunAgentDeleteSavedWorkflowParams,
  ): Promise<RobinRunWorkflowsDeleteResult>;
  listSavedWorkflowRuns(
    params: RobinRunAgentListSavedWorkflowRunsParams,
  ): Promise<RobinRunWorkflowsRunsResult>;
  // 在项目档 / 全局档之间移动同名文件：
  // `workspace` 是载体（移到项目传目标项目、移到全局传源项目），`to` 是落点档；不覆盖已存在的目标。
  moveSavedWorkflow(params: RobinRunAgentMoveSavedWorkflowParams): Promise<RobinRunWorkflowsMoveResult>;
  // 完成卡的「直接保存」（docs/dynamic-workflow/transcript-and-notifications.md）：按 runId 从
  // journal 取这次 run 实际跑过的脚本落盘，不经模型回合。两者都必带 workspace（journal 在那里）。
  saveSavedWorkflowFromRun(
    params: RobinRunAgentSaveSavedWorkflowFromRunParams,
  ): Promise<RobinRunWorkflowsSaveResult>;
  /** 这次 run 对应哪个已保存工作流（推导，不记忆）；顺带回 run 的实参供「再次运行」预填。 */
  findSavedWorkflowForRun(
    params: RobinRunAgentFindSavedWorkflowForRunParams,
  ): Promise<RobinRunWorkflowsForRunResult>;
  resolveSuggestedPluginReference(
    params: RobinRunAgentResolveSuggestedPluginReferenceParams,
  ): Promise<import("@robinrun/shared").RobinRunPluginsResolveSuggestedReferenceResult>;
  /** 推荐项 Plugin 首次本地检查缺失后的 operation-scoped 刷新进度。 */
  onDynamicPluginOperationProgress(
    operationId: string,
  ): Event<RobinRunPluginOperationProgressNotification>;
  getPluginsOverview(params: RobinRunAgentPluginViewParams): Promise<RobinRunPluginsOverviewResult>;
  /**
   * 资源管理器：枚举本 Host 内全部本地 Agent 进程（含 plugin / mcp-status 泳道），
   * 并向每个存活 runtime 请求 `process/childProcesses`；单个 runtime 失败只让它的 children 为空。
   */
  collectLocalRuntimeChildProcesses(
    signal?: AbortSignal,
  ): Promise<RobinRunAgentLocalRuntimeChildProcesses[]>;
  addPluginMarketplace(
    params: RobinRunAgentAddPluginMarketplaceParams,
  ): Promise<RobinRunPluginsMarketplaceMutationResult>;
  removePluginMarketplace(
    params: RobinRunAgentRemovePluginMarketplaceParams,
  ): Promise<RobinRunPluginsMarketplaceMutationResult>;
  updatePluginMarketplace(
    params: RobinRunAgentUpdatePluginMarketplaceParams,
  ): Promise<RobinRunPluginsMarketplaceMutationResult>;
  installPlugin(params: RobinRunAgentInstallPluginParams): Promise<RobinRunPluginsInstallResult>;
  cancelPluginOperation(
    params: RobinRunAgentCancelPluginOperationParams,
  ): Promise<RobinRunPluginsCancelOperationResult>;
  uninstallPlugin(params: RobinRunAgentUninstallPluginParams): Promise<RobinRunPluginsUninstallResult>;
  updatePlugin(params: RobinRunAgentUpdatePluginParams): Promise<RobinRunPluginsInstallResult>;
  restoreBuiltinPlugin(
    params: RobinRunAgentRestoreBuiltinPluginParams,
  ): Promise<RobinRunPluginsRestoreBuiltinResult>;
  configurePlugin(params: RobinRunAgentConfigurePluginParams): Promise<RobinRunPluginsConfigureResult>;
  resetPluginConfig(
    params: RobinRunAgentResetPluginConfigParams,
  ): Promise<RobinRunPluginsConfigureResult>;
  validatePlugin(params: RobinRunAgentValidatePluginParams): Promise<RobinRunPluginsValidateResult>;
  describePlugin(params: RobinRunAgentDescribePluginParams): Promise<RobinRunPluginsDescribeResult>;
  setPluginEnabled(params: RobinRunAgentSetPluginEnabledParams): Promise<RobinRunPluginsSetEnabledResult>;
  // ---- 定时任务(automation)管理 ----
  listAutomations(params: RobinRunAgentWorkspaceTarget): Promise<RobinRunAutomation[]>;
  listAllAutomations(): Promise<RobinRunAutomation[]>;
  createAutomation(params: RobinRunAgentCreateAutomationParams): Promise<RobinRunAutomation>;
  updateAutomation(params: RobinRunAgentUpdateAutomationParams): Promise<RobinRunAutomation | null>;
  deleteAutomation(params: RobinRunAgentAutomationIdParams): Promise<void>;
  setAutomationEnabled(params: RobinRunAgentSetAutomationEnabledParams): Promise<void>;
  restartAutomation(params: RobinRunAgentAutomationIdParams): Promise<void>;
  runAutomationNow(params: RobinRunAgentAutomationIdParams): Promise<RobinRunAgentRunAutomationNowResult>;
  listAutomationRuns(params: RobinRunAgentAutomationIdParams): Promise<RobinRunAutomationRun[]>;
  deleteAutomationRun(params: RobinRunAgentDeleteAutomationRunParams): Promise<void>;
  generateWorkspaceText(
    params: RobinRunAgentGenerateWorkspaceTextParams,
  ): Promise<RobinRunWorkspaceGenerateTextResult>;
  testModelConnectivity(
    params: RobinRunAgentTestModelConnectivityParams,
  ): Promise<RobinRunProviderTestModelConnectivityResult>;
  /**
   * @deprecated：send 主路径已收敛 v4 sendText 命令。仅剩两个消费点——
   * adapter 带附件输入回退（待附件命令面落地后移除）与 robinrunSessionService
   * pass-through；新代码禁止回用。
   */
  sendPrompt(params: RobinRunAgentSendPromptParams): Promise<RobinRunSessionSendResult>;
  compactSession(params: RobinRunAgentCompactParams): Promise<RobinRunSessionCompactResult>;
  goalSession(params: RobinRunAgentGoalParams): Promise<RobinRunSessionGoalResult>;
  closeSession(
    params: RobinRunAgentSessionTarget & { expectedPersistence?: "deferred" | "immediate" },
  ): Promise<boolean>;
  setModel(params: RobinRunAgentSetModelParams): Promise<RobinRunSessionStateSnapshot>;
  setThoughtLevel(params: RobinRunAgentSetThoughtLevelParams): Promise<RobinRunSessionStateSnapshot>;
  setMode(params: RobinRunAgentSetModeParams): Promise<RobinRunSessionStateSnapshot>;
  respondProviderRuntimeHeaders(
    params: RobinRunAgentRespondProviderRuntimeHeadersParams,
  ): Promise<void>;
  respondSessionRuntimePreferences(
    params: RobinRunAgentRespondSessionRuntimePreferencesParams,
  ): Promise<void>;
  /**
   * v4 UI 的 Start Plan runtime-auth bridge 只需要本地 pending request 事件，
   * 不能为此额外打开旧 `session/subscribe`，否则会把旧 replay/continuous 读路径
   * 重新带回 v4 pane。
   */
  onDynamicProviderRuntimeHeadersRequest(
    params: RobinRunAgentSessionTarget,
  ): Event<RobinRunAgentProviderRuntimeHeadersRequest>;
  /**
   * Start Plan runtime headers 的 workspace 级订阅入口（生产应答方使用）。
   * Bug 原因（2026-08-16 web 远控卡死）：session 级入口只随桌面 pane 挂载订阅，
   * web 远控新建会话在桌面没有 pane、web 端无应答方，请求校验请求滞留 pending，
   * 任务永久「工作中」。桌面窗口用本入口为每个打开的 workspace tab 维持常驻应答方；
   * 订阅时先注册 live listener 再按 workspaceKey 前缀补投 pending，与 session 级同语义。
   */
  onDynamicWorkspaceProviderRuntimeHeadersRequest(
    params: RobinRunAgentWorkspaceTarget,
  ): Event<RobinRunAgentProviderRuntimeHeadersRequest>;
  /** 只投递本 workspace 的校验取消，不属于 conversation stream。 */
  onDynamicWorkspaceProviderRuntimeHeadersCancelled(
    params: RobinRunAgentWorkspaceTarget,
  ): Event<RobinRunProviderRuntimeHeadersCancelled>;
  onDynamicSessionRuntimePreferencesRequest(): Event<RobinRunAgentSessionRuntimePreferencesRequest>;
  /**
   * CLI 进程级资源样本，带 services 打的 lane 标签（CLI 自己不知道 lane）。
   * 使用 dynamic event 避免 RPC 服务在无人订阅时缓冲周期事件；
   * 该事件不属于 session/conversation continuous 或 replayable 状态。
   */
  onDynamicProcessResourceSample(): Event<AgentLaneResourceSample>;
  /** MCP 进程生命周期与低频内存事件，仅供可信 Host relay 上报 ARMS。 */
  /** 仅 trusted Host relay 订阅；手机统计不依赖 renderer 生命周期。 */
  onDynamicRemoteConversationTelemetry(): Event<RemoteConversationTelemetryEvent>;

  onDynamicMcpTelemetry(): Event<RobinRunMcpTelemetryEvent>;
  /** MCP 进程树资源事实，只供可信 Host 汇总上报。 */
  onDynamicMcpResourceSamples(): Event<RobinRunMcpResourceSample[]>;
  /** Bash 完成事实，仅可信 Host 资源旁路订阅。 */
  onDynamicToolExecResource(): Event<RobinRunToolExecResource>;
  /**
   * @deprecated 旧协议订阅面（session/subscribe + session/event + state.updated）。
   * task-index syncer 已迁 v4 sessions-index/workspace-config 帧；
   * 仅剩 robinrunTaskServiceAdapter.onDynamicTaskEvent（replayable 读路径）消费。
   * 写路径已收敛 v4 命令面；本订阅是读路径投影源。
   */
  onDynamicSessionEvent(params: RobinRunAgentSessionSubscribeParams): Event<RobinRunAgentServiceEvent>;
  // ── v4 conversation 通道（竖切）──
  /** RPC attachment 建立后先读取 host 可信 hello。 */
  helloConversationV4(): Promise<HelloMessage>;
  /** hello 校验后回送 clientHello；metadata 不能覆盖 connection mode/profile。 */
  initializeConversationV4(clientHello: ClientHello): Promise<void>;
  /** 仅供 trusted host relay/facade；terminal RPC caller 必须被 connection scope 拒绝。 */
  setConnectionFlowStateV4(params: RobinRunAgentConnectionFlowParams): Promise<void>;
  subscribeConversationV4(
    params: RobinRunAgentConversationSubscribeParams,
  ): Promise<V4ConversationSubscribeResult>;
  resyncConversationV4(
    params: RobinRunAgentConversationResyncParams,
  ): Promise<V4ConversationResyncResult>;
  unsubscribeConversationV4(params: RobinRunAgentConversationUnsubscribeParams): Promise<void>;
  /** rows/range 行分页 query（loadOlder 游标向上补历史）。 */
  conversationRowsRangeV4(
    params: RobinRunAgentConversationRowsRangeParams,
  ): Promise<V4ConversationRowsRangeResult>;
  conversationPlansV4(
    params: RobinRunAgentConversationPlansParams,
  ): Promise<V4ConversationPlansResult>;
  /** 输入预测：只读、无状态；Host 开关关闭 / 无运行时 / 失败一律回空结果，不抛错。 */
  conversationInputPredictionV4(
    params: RobinRunAgentConversationInputPredictionParams,
  ): Promise<V4ConversationInputPredictionResult>;
  /** workflow run 事件日志分页；与 plans 同族（只读、无状态、超时重发安全）。 */
  conversationWorkflowRunEventsV4(
    params: RobinRunAgentConversationWorkflowRunEventsParams,
  ): Promise<V4ConversationWorkflowRunEventsResult>;
  /** workflow run 枚举；journal-backed 的重启后发现面。 */
  conversationWorkflowRunsV4(
    params: RobinRunAgentConversationWorkflowRunsParams,
  ): Promise<V4ConversationWorkflowRunsResult>;
  /** workflow run 的用户面产物清单；与 plans 同族（只读、无状态、超时重发安全）。 */
  conversationWorkflowRunArtifactsV4(
    params: RobinRunAgentConversationWorkflowRunArtifactsParams,
  ): Promise<V4ConversationWorkflowRunArtifactsResult>;
  /** 预置看板的条目分页；hook 以 itemCount 变化为信号增量拉取。 */
  conversationWorkflowRunArtifactDataV4(
    params: RobinRunAgentConversationWorkflowRunArtifactDataParams,
  ): Promise<V4ConversationWorkflowRunArtifactDataResult>;
  /** 内容产物的字节，一次一块；授权在 CLI 侧（journal 行才是取字节的依据）。 */
  conversationWorkflowRunArtifactReadV4(
    params: RobinRunAgentConversationWorkflowRunArtifactReadParams,
  ): Promise<V4ConversationWorkflowRunArtifactReadResult>;
  /** dwf 工作区 transcript 的清单。 */
  conversationWorkflowRunWorkspaceV4(
    params: RobinRunAgentConversationWorkflowRunWorkspaceParams,
  ): Promise<V4ConversationWorkflowRunWorkspaceResult>;
  /** 一个工作区节点的有界正文。 */
  conversationWorkflowRunNodeResultV4(
    params: RobinRunAgentConversationWorkflowRunNodeResultParams,
  ): Promise<V4ConversationWorkflowRunNodeResultResult>;
  backgroundBashOutputV4(
    params: RobinRunAgentBackgroundBashOutputParams,
  ): Promise<BackgroundBashOutputResult>;
  conversationFileChangesV4(
    params: RobinRunAgentConversationFileChangesParams,
  ): Promise<V4ConversationFileChangesResult>;
  conversationFileRewindPreviewV4(
    params: RobinRunAgentConversationFileRewindPreviewParams,
  ): Promise<V4ConversationFileRewindPreviewResult>;
  sendConversationCommandV4(params: RobinRunAgentConversationCommandParams): Promise<CommandAck>;
  queryConversationCommandsV4(params: RobinRunAgentCommandsQueryParams): Promise<CommandsQueryResult>;
  attachmentBeginV4(params: RobinRunAgentAttachmentBeginParams): Promise<V4AttachmentBeginResult>;
  attachmentChunkV4(params: RobinRunAgentAttachmentChunkParams): Promise<V4AttachmentChunkResult>;
  attachmentCommitV4(params: RobinRunAgentAttachmentTerminalParams): Promise<V4AttachmentCommitResult>;
  attachmentAbortV4(params: RobinRunAgentAttachmentTerminalParams): Promise<void>;
  /** Desktop local 已发送视频 source query；远端与 Web 返回 chunked。 */
  attachmentPreviewSourceV4(
    params: RobinRunAgentAttachmentPreviewSourceParams,
  ): Promise<V4AttachmentPreviewSourceResult>;
  /** 已发送 image/video 只读分块查询；connection scope 注入可信 workspace 连接。 */
  attachmentReadV4(params: RobinRunAgentAttachmentReadParams): Promise<V4AttachmentReadResult>;
  /** Share 读取 userInput 附件，允许 text/plain 等非媒体类型。 */
  conversationAttachmentReadV4(
    params: RobinRunAgentConversationAttachmentReadParams,
  ): Promise<V4ConversationAttachmentReadResult>;
  /** Share 选择阶段只读 userInput 附件元数据，不读取完整内容。 */
  conversationAttachmentStatV4(
    params: RobinRunAgentConversationAttachmentStatParams,
  ): Promise<V4ConversationAttachmentStatResult>;
  getSessionLifecycle(
    params: RobinRunAgentSessionTarget,
  ): Promise<import("@robinrun/shared").SessionLifecycleSnapshot | null>;
  ensureSessionReady(params: RobinRunAgentSessionTarget): Promise<void>;
  stopSessionRuntime(params: RobinRunAgentSessionTarget): Promise<void>;
  restartSessionRuntime(params: RobinRunAgentSessionTarget): Promise<void>;
  /** 独立于可被释放的 conversation publisher 的生命周期事实。 */
  onDynamicSessionLifecycle(
    params: RobinRunAgentWorkspaceTarget,
  ): Event<import("@robinrun/shared").SessionLifecycleSnapshot>;
  /** workspace 级下行帧流（v4/conversation/frame），renderer 侧按 topic 自行路由。 */
  onDynamicConversationFrame(
    params: RobinRunAgentWorkspaceTarget,
  ): Event<ConversationTopicWireCandidate>;
  /** workspace 级 live telemetry 事实；connection facade 仅向可信 desktop-continuous 下游暴露。 */
  onDynamicLocalTtftFacts(
    params: RobinRunAgentWorkspaceTarget,
  ): Event<import("@robinrun/shared").LocalTtftFacts>;
  onDynamicConversationTelemetryFact(
    params: RobinRunAgentWorkspaceTarget,
  ): Event<ConversationTelemetryFact>;
  /** Host 消费驻留 CLI 的闲时生命周期；不参与聊天快照恢复。 */
  onDynamicOffPeakLifecycle(
    params: RobinRunAgentWorkspaceTarget,
  ): Event<import("@robinrun/shared").OffPeakLifecycleNotification>;
  controlOffPeakExecutionV4(
    params: RobinRunAgentWorkspaceTarget & { control: import("@robinrun/shared").OffPeakControlParams },
  ): Promise<import("@robinrun/shared").OffPeakControlResult>;
  /** 当前窗口全部本地 live task 的 CUA 权限观察；历史、远程与 replayable 不在此事件面。 */
  onDynamicCuaPermissionObservation(): Event<RobinRunAgentCuaPermissionObservation>;
  /** 本地桌面窗口创建插件页面，不依赖 conversation 订阅。 */
  onDynamicPluginUiToolResult(): Event<
    PluginUiToolResultNotification & { workspacePath: string; workspaceIdentity?: string }
  >;
  /** 只读 CLI 持久事实；不恢复会话运行实例。旧远端可以不提供此能力。 */
  reconcileSessionsIndexV4?(
    params: RobinRunAgentWorkspaceTarget & { sessionIds: string[] },
  ): Promise<SessionsIndexReconcileResult>;
  // ── M5 sessions-index 通道（列表活性）──
  subscribeSessionsIndexV4(
    params: RobinRunAgentSessionsIndexSubscribeParams,
  ): Promise<V4SessionsIndexSubscribeResult>;
  resyncSessionsIndexV4(
    params: RobinRunAgentConversationResyncParams,
  ): Promise<V4ConversationResyncResult>;
  unsubscribeSessionsIndexV4(params: RobinRunAgentConversationUnsubscribeParams): Promise<void>;
  /** workspace 级 sessions-index 下行帧流（与 conversation 同一通知，按 topic 前缀分流）。 */
  onDynamicSessionsIndexFrame(
    params: RobinRunAgentWorkspaceTarget,
  ): Event<SessionsIndexTopicWireCandidate>;
  // ── workspace-config 通道（配置目录活性；task-index syncer 消费）──
  subscribeWorkspaceConfigV4(
    params: RobinRunAgentWorkspaceConfigSubscribeParams,
  ): Promise<V4WorkspaceConfigSubscribeResult>;
  resyncWorkspaceConfigV4(
    params: RobinRunAgentConversationResyncParams,
  ): Promise<V4ConversationResyncResult>;
  unsubscribeWorkspaceConfigV4(params: RobinRunAgentConversationUnsubscribeParams): Promise<void>;
  /** workspace 级 workspace-config 下行帧流（与 conversation 同一通知，按 topic 前缀分流）。 */
  onDynamicWorkspaceConfigFrame(
    params: RobinRunAgentWorkspaceTarget,
  ): Event<WorkspaceConfigTopicWireCandidate>;
  /**
   * （CLI 重连重订）：agent 进程换代通知（超时回收/崩溃后重新拉起）。
   * v4 订阅活在 CLI 进程内存，进程换代即失效；订阅方（task-index syncer 等）
   * 收到后必须对该 workspaceKey 重发 subscribe，否则帧流静默中断。
   */
  onAgentRuntimeRestarted(listener: (event: { workspaceKey: string }) => void): IDisposable;
  /**
   * Agent client 在 service 内完成登记后发布 available，当前 client 关闭后发布 unavailable。
   * 这是被动 observer attach/detach 的唯一生命周期信号，不表达用户使用租约。
   */
  onAgentRuntimeLifecycle?: (
    listener: (event: RobinRunAgentRuntimeLifecycleEvent) => void,
  ) => IDisposable;
  /** 当前 desktop-local CUA turn 是否仍在执行，用于 Helper recovery 避免中途回收 Agent。 */
  hasActiveCuaOperationTurn(): boolean;
  disposeWorkspace(
    params: RobinRunAgentWorkspaceTarget & { releasePreparation?: boolean },
  ): Promise<void>;
  disposeAll(): void;
}

export const IRobinRunAgentService = createServiceDescriptor<IRobinRunAgentService>(
  ServiceChannels.RobinRunAgent,
);
