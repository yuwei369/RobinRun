import { z } from "zod";
import type { CommandAgentSource } from "./command-types.js";
import type { RobinRunProvider } from "./robinrun-task-types-core.js";

export const ROBINRUN_AGENT_PROVIDER = "glm" satisfies RobinRunProvider;
export const ROBINRUN_AGENT_PROVIDER_LABEL = "RobinRun Agent";
export const ROBINRUN_COMMAND_AGENT_SOURCE = "robinrunAgent" satisfies CommandAgentSource;

/**
 * 解析持久化/relay 数据时的 provider 归一 schema：
 * 已移除的第三方 provider 历史值仅作为归一化输入保留，统一收敛为 glm；
 * 其它非法值保持拒绝，与收窄前的校验边界一致。
 */
export const legacyRobinRunProviderSchema = z
  .enum(["claude", "opencode", "gemini", "codex", "glm"])
  .transform((): typeof ROBINRUN_AGENT_PROVIDER => ROBINRUN_AGENT_PROVIDER);

export const ROBINRUN_ENABLED_AGENT_PROVIDERS = [
  ROBINRUN_AGENT_PROVIDER,
] as const satisfies readonly RobinRunProvider[];

export const ROBINRUN_COMMAND_AGENT_SOURCES = [
  ROBINRUN_COMMAND_AGENT_SOURCE,
] as const satisfies readonly CommandAgentSource[];

export function normalizeAgentProviderToRobinRunAgent(
  _provider?: RobinRunProvider | null,
): RobinRunProvider {
  return ROBINRUN_AGENT_PROVIDER;
}

export function normalizeAgentProvidersToRobinRunAgent(
  _providers?: ReadonlyArray<RobinRunProvider> | null,
): RobinRunProvider[] {
  return [...ROBINRUN_ENABLED_AGENT_PROVIDERS];
}

export function normalizeCommandAgentSourceToRobinRunAgent(
  _agentSource?: CommandAgentSource | null,
): CommandAgentSource {
  return ROBINRUN_COMMAND_AGENT_SOURCE;
}

export function isRobinRunAgentProvider(
  provider: RobinRunProvider | null | undefined,
): provider is typeof ROBINRUN_AGENT_PROVIDER {
  return provider === ROBINRUN_AGENT_PROVIDER;
}
