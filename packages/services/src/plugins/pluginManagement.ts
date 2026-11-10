// 平台能力面收敛：设置页「插件管理」的薄服务接口。
//
// 背景：pluginManagementStore / usePluginUninstall 过去直接注入 IRobinRunAgentService，
// UI 层因此散布 13 个 plugins/* 旧协议词的消费点。收敛为独立薄 service 后，UI 只依赖
// 本接口；plugins/* 词表的 host 侧消费点收拢到 pluginManagementService 一处（插件的
// 事实源在 robinrun-cli 进程，服务实现仍经 agent 协议往返——plugins 词表的收口归属
// 插件能力面自身的协议演进，不在会话 v4 词表范围内）。
// 注意与既有 IPluginsService（已 retired 的 marketplace pluginStore 通道）区分：
// 那套接口按 pluginName+marketplace 寻址且方法语义过时，不复用避免签名冲突。
import type { Event } from "@robinrun/rpc";
import type {
  RobinRunPluginOperationProgressNotification,
  RobinRunPluginsConfigureResult,
  RobinRunPluginsCancelOperationResult,
  RobinRunPluginsDescribeResult,
  RobinRunPluginsInstallResult,
  RobinRunPluginsListResult,
  RobinRunPluginsMarketplaceMutationResult,
  RobinRunPluginsOverviewResult,
  RobinRunPluginsReferenceCatalogResult,
  RobinRunPluginsRestoreBuiltinResult,
  RobinRunPluginsSetEnabledResult,
  RobinRunPluginsUninstallResult,
  RobinRunPluginsValidateResult,
} from "@robinrun/shared";
import { ServiceChannels } from "@robinrun/shared";
import { createServiceDescriptor } from "../descriptors.js";
import type {
  RobinRunAgentAddPluginMarketplaceParams,
  RobinRunAgentConfigurePluginParams,
  RobinRunAgentCancelPluginOperationParams,
  RobinRunAgentDescribePluginParams,
  RobinRunAgentInstallPluginParams,
  RobinRunAgentPluginReferenceCatalogParams,
  RobinRunAgentResolveSuggestedPluginReferenceParams,
  RobinRunAgentResetPluginConfigParams,
  RobinRunAgentPluginViewParams,
  RobinRunAgentRemovePluginMarketplaceParams,
  RobinRunAgentRestoreBuiltinPluginParams,
  RobinRunAgentSetPluginEnabledParams,
  RobinRunAgentUninstallPluginParams,
  RobinRunAgentUpdatePluginMarketplaceParams,
  RobinRunAgentUpdatePluginParams,
  RobinRunAgentValidatePluginParams,
} from "../robinrun-agent/robinrunAgentPluginParams.js";

export interface IPluginManagementService {
  listPlugins(params: RobinRunAgentPluginViewParams): Promise<RobinRunPluginsListResult>;
  /**
   * Plugin 对话引用 catalog：
   * 带 sessionId → session-owned 冻结 catalog；不带 → workspace 当前 catalog。
   * 实现路由到 workspace 级 agent client，不走插件管理独立进程。
   */
  getPluginReferenceCatalog(
    params: RobinRunAgentPluginReferenceCatalogParams,
  ): Promise<RobinRunPluginsReferenceCatalogResult>;
  resolveSuggestedPluginReference(
    params: RobinRunAgentResolveSuggestedPluginReferenceParams,
  ): Promise<import("@robinrun/shared").RobinRunPluginsResolveSuggestedReferenceResult>;
  onDynamicPluginOperationProgress(
    operationId: string,
  ): Event<RobinRunPluginOperationProgressNotification>;
  getPluginsOverview(params: RobinRunAgentPluginViewParams): Promise<RobinRunPluginsOverviewResult>;
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
}

export const IPluginManagementService = createServiceDescriptor<IPluginManagementService>(
  ServiceChannels.PluginManagement,
);

/** 入口只附加观测上下文；RPC 方法由 Proxy 动态提供，不能通过对象展开复制。 */
export function withPluginTelemetry(
  service: IPluginManagementService,
  telemetry: NonNullable<RobinRunAgentInstallPluginParams["telemetry"]>,
): IPluginManagementService {
  const mutations = new Set<PropertyKey>([
    "addPluginMarketplace",
    "removePluginMarketplace",
    "updatePluginMarketplace",
    "installPlugin",
    "uninstallPlugin",
    "updatePlugin",
    "restoreBuiltinPlugin",
    "configurePlugin",
    "resetPluginConfig",
    "setPluginEnabled",
  ]);
  return new Proxy(service, {
    get(target, property) {
      const method = Reflect.get(target, property, target);
      if (typeof method !== "function") return method;
      if (!mutations.has(property)) return method.bind(target);
      return (params: RobinRunAgentInstallPluginParams) =>
        method.call(target, { ...params, telemetry });
    },
  });
}
