import type {
  ModelSelection,
  RobinRunAgentMcpServer,
  RobinRunAutomationScheduleRule,
  RobinRunMcpListMode,
} from "@robinrun/shared";
import type { McpAppsAppToolCallResult, McpAppsAppToolDescriptor } from "@robinrun/shared/mcp-apps";

export interface RobinRunAgentWorkspaceTarget {
  workspacePath: string;
  workspaceIdentity?: string;
  /** 远程 workspace 的运行时会话身份；只用于隔离/路由，不能替代 workspacePath。 */
  remoteSessionId?: string;
}

export interface RobinRunAgentPluginMutationTarget extends RobinRunAgentWorkspaceTarget {
  /** 仅 Host 观测使用；不会传给 CLI。 */
  telemetry?: {
    entry?:
      | "store_list"
      | "store_detail"
      | "side_pane_market"
      | "recommended_prompt"
      | "recommended_ui"
      | "component_settings";
    client_kind?: "desktop" | "mobile";
    trigger?: "user" | "automatic" | "dependency" | "restore" | "sync";
  };
}

export interface RobinRunAgentPluginViewParams extends RobinRunAgentWorkspaceTarget {
  configScope?: "user" | "workspace";
}

export interface RobinRunAgentListMcpServerStatusesParams extends RobinRunAgentWorkspaceTarget {
  mcpServers?: RobinRunAgentMcpServer[];
  mode?: RobinRunMcpListMode;
}

export interface RobinRunAgentAddPluginMarketplaceParams extends RobinRunAgentPluginMutationTarget {
  dryRun?: boolean;
  operationId?: string;
  source: string;
}

export interface RobinRunAgentRemovePluginMarketplaceParams extends RobinRunAgentPluginMutationTarget {
  marketplace: string;
}

export interface RobinRunAgentUpdatePluginMarketplaceParams extends RobinRunAgentPluginMutationTarget {
  marketplace?: string;
  operationId?: string;
}

export interface RobinRunAgentInstallPluginParams extends RobinRunAgentPluginMutationTarget {
  dryRun?: boolean;
  marketplace: string;
  operationId?: string;
  pluginName: string;
  scope?: "user" | "workspace";
}

export interface RobinRunAgentCancelPluginOperationParams {
  operationId: string;
}

export interface RobinRunAgentUninstallPluginParams extends RobinRunAgentPluginMutationTarget {
  marketplace?: string;
  pluginId?: string;
  pluginName?: string;
  removeCache?: boolean;
}

export interface RobinRunAgentUpdatePluginParams extends RobinRunAgentPluginMutationTarget {
  pluginId?: string;
  marketplace?: string;
}

export interface RobinRunAgentRestoreBuiltinPluginParams extends RobinRunAgentPluginMutationTarget {
  pluginId: string;
}

export interface RobinRunAgentConfigurePluginParams extends RobinRunAgentPluginMutationTarget {
  clearOptionKeys?: string[];
  dryRun?: boolean;
  options: Record<string, unknown>;
  pluginId: string;
  scope?: "user" | "workspace";
}

export interface RobinRunAgentResetPluginConfigParams extends RobinRunAgentPluginMutationTarget {
  pluginId: string;
  scope?: "user" | "workspace";
}

export interface RobinRunAgentValidatePluginParams extends RobinRunAgentWorkspaceTarget {
  marketplace?: string;
  pluginName?: string;
  source?: string;
}

export interface RobinRunAgentDescribePluginParams extends RobinRunAgentWorkspaceTarget {
  marketplace: string;
  pluginName: string;
}

export interface RobinRunAgentSetPluginEnabledParams extends RobinRunAgentPluginMutationTarget {
  enabled: boolean;
  operationId?: string;
  pluginId: string;
  scope?: "user" | "workspace";
}

// Plugin 对话引用 catalog：
// 带 sessionId → session-owned 冻结 catalog（必须路由到持有该 session 的 workspace client）；
// 不带 → workspace 当前 catalog（新建草稿 Picker）。
export interface RobinRunAgentPluginReferenceCatalogParams extends RobinRunAgentWorkspaceTarget {
  sessionId?: string;
}

// Composer Skill catalog：与 Plugin 引用相同，以 sessionId 区分 workspace 当前目录和
// resident Session runtime 快照；不参与 Settings 管理目录。
export interface RobinRunAgentSkillReferenceCatalogParams extends RobinRunAgentWorkspaceTarget {
  sessionId?: string;
}

/** 插件 UI：UI 发起的 `ui://` 资源读取。 */
export interface RobinRunAgentReadMcpResourceParams extends RobinRunAgentWorkspaceTarget {
  instance: import("@robinrun/shared/mcp-apps").McpAppInstance;
  sessionId: string;
  pluginId: string;
  serverName: string;
  uri: string;
}

/** 插件 UI 页面发起的 `resources/read`；参数与 readMcpResource 同形，结果受 8 MiB 与 mimeType 白名单约束。 */
export type RobinRunAgentReadMcpResourceForUiParams = RobinRunAgentReadMcpResourceParams;

/** 插件 UI：UI 回调本插件工具；不进审批流，归属由 agent 侧 catalog fail closed。 */
export interface RobinRunAgentCallMcpToolForUiParams extends RobinRunAgentWorkspaceTarget {
  instance: import("@robinrun/shared/mcp-apps").McpAppInstance;
  sessionId: string;
  pluginId: string;
  serverName: string;
  toolName: string;
  arguments?: Record<string, unknown>;
  /** 宿主生成的调用 id，配合 cancelMcpToolCallForUi。 */
  callId: string;
}
/** 插件 UI 页面发起的 resources/list、resources/templates/list、subscribe、unsubscribe。 */
export interface RobinRunAgentListMcpResourcesForUiParams extends RobinRunAgentWorkspaceTarget {
  instance: import("@robinrun/shared/mcp-apps").McpAppInstance;
  sessionId: string;
  pluginId: string;
  serverName: string;
  cursor?: string;
}
/** App-Provided Tools：实例身份 = 会话 + 沙箱作用域 + 代际。 */
export interface RobinRunAgentAppToolInstanceForUiParams extends RobinRunAgentWorkspaceTarget {
  instance: import("@robinrun/shared/mcp-apps").McpAppInstance;
  sessionId: string;
  pluginId: string;
  serverName: string;
  scopeId: string;
  generation: number;
}
export interface RobinRunAgentRegisterAppToolsForUiParams extends RobinRunAgentAppToolInstanceForUiParams {
  tools: McpAppsAppToolDescriptor[];
}
export interface RobinRunAgentAppToolCallForUiParams extends RobinRunAgentAppToolInstanceForUiParams {
  callId: string;
}
export interface RobinRunAgentResolveAppToolCallForUiParams extends RobinRunAgentAppToolCallForUiParams {
  result?: McpAppsAppToolCallResult;
  error?: { message: string };
}
export interface RobinRunAgentMcpResourceSubscriptionForUiParams extends RobinRunAgentWorkspaceTarget {
  instance: import("@robinrun/shared/mcp-apps").McpAppInstance;
  sessionId: string;
  pluginId: string;
  serverName: string;
  scopeId: string;
  generation: number;
  uri: string;
}
export interface RobinRunAgentCancelMcpToolCallForUiParams extends RobinRunAgentWorkspaceTarget {
  instance: import("@robinrun/shared/mcp-apps").McpAppInstance;
  sessionId: string;
  pluginId: string;
  serverName: string;
  callId: string;
}
export interface RobinRunAgentResolveSuggestedPluginReferenceParams extends RobinRunAgentWorkspaceTarget {
  stableId: string;
  operationId: string;
  clientMode: "desktop-continuous" | "web-remote-replayable";
  deliveryKind: "desktop-continuous" | "web-remote-replayable";
}

// ---- 定时任务(automation)管理参数 ----

export interface RobinRunAgentCreateAutomationParams extends RobinRunAgentWorkspaceTarget {
  projectId?: string | null;
  title: string;
  cronExpr: string;
  relativeDelayMinutes?: number;
  prompt: string;
  modelSelection?: ModelSelection;
  mode?: string;
  recurring?: boolean;
  maxRuns?: number;
  endAt?: number;
  scheduleRule?: RobinRunAutomationScheduleRule;
}

export interface RobinRunAgentUpdateAutomationParams extends RobinRunAgentWorkspaceTarget {
  automationId: string;
  title?: string;
  cronExpr?: string;
  prompt?: string;
  modelSelection?: ModelSelection | null;
  mode?: string | null;
  recurring?: boolean;
  maxRuns?: number | null;
  endAt?: number | null;
  scheduleRule?: RobinRunAutomationScheduleRule | null;
  scheduleEditedByUser?: boolean;
}

export interface RobinRunAgentAutomationIdParams extends RobinRunAgentWorkspaceTarget {
  automationId: string;
}

export interface RobinRunAgentSetAutomationEnabledParams extends RobinRunAgentWorkspaceTarget {
  automationId: string;
  enabled: boolean;
}

export interface RobinRunAgentDeleteAutomationRunParams extends RobinRunAgentWorkspaceTarget {
  runId: string;
}
