import { materializeRobinRunBuiltinProviderConfig } from "@robinrun/services/node";

declare const __ROBINRUN_BUILTIN_PROVIDER_CONFIG_JSON__: string | undefined;

export interface MaterializeBundledRobinRunBuiltinProviderConfigOptions {
  readonly environmentConfigRoot: string;
  readonly content: string;
}

/** 返回构建时嵌入远端 Server 的 RobinRun Built-in Provider Config。 */
export function readBundledRobinRunBuiltinProviderConfig(): string {
  if (typeof __ROBINRUN_BUILTIN_PROVIDER_CONFIG_JSON__ !== "string") {
    throw new Error("当前构建未嵌入 RobinRun Built-in Provider Config");
  }
  return __ROBINRUN_BUILTIN_PROVIDER_CONFIG_JSON__;
}

/**
 * 将 RobinRun Built-in Config 原子物化到所属环境的固定资源副本。
 * 升级前退出旧进程；不保留按内容 hash 增长的历史文件。
 */
export async function materializeBundledRobinRunBuiltinProviderConfig(
  options: MaterializeBundledRobinRunBuiltinProviderConfigOptions,
): Promise<string> {
  return materializeRobinRunBuiltinProviderConfig(options);
}
