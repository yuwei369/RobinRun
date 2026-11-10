export const ROBINRUN_BUILTIN_PROVIDER_CONFIG_FILE_ENV = "ROBINRUN_BUILTIN_PROVIDER_CONFIG_FILE";
export const ROBINRUN_BUILTIN_PROVIDER_BUNDLED_CONFIG_FILE_ENV =
  "ROBINRUN_BUILTIN_PROVIDER_BUNDLED_CONFIG_FILE";
export const ROBINRUN_PERSONAL_PROVIDER_CONFIG_FILE_ENV = "ROBINRUN_PERSONAL_PROVIDER_CONFIG_FILE";
export const PERSONAL_PROVIDER_CONFIG_FILE_NAME = "provider_config.json";

export interface NodeProviderRuntimePaths {
  readonly robinrunBuiltinFilePath: string;
  readonly personalFilePath: string;
}

export function createNodeProviderRuntimePathEnv(
  paths: NodeProviderRuntimePaths,
): Record<string, string> {
  return {
    [ROBINRUN_BUILTIN_PROVIDER_CONFIG_FILE_ENV]: paths.robinrunBuiltinFilePath,
    [ROBINRUN_PERSONAL_PROVIDER_CONFIG_FILE_ENV]: paths.personalFilePath,
  };
}

export function resolveNodeProviderRuntimePaths(
  env: Readonly<Record<string, string | undefined>>,
): NodeProviderRuntimePaths | null {
  const robinrunBuiltinFilePath = env[ROBINRUN_BUILTIN_PROVIDER_CONFIG_FILE_ENV]?.trim();
  const personalFilePath = env[ROBINRUN_PERSONAL_PROVIDER_CONFIG_FILE_ENV]?.trim();
  if (!robinrunBuiltinFilePath && !personalFilePath) return null;
  if (!robinrunBuiltinFilePath || !personalFilePath) {
    throw new Error("RobinRun Built-in 与 Personal Provider Config 路径必须同时提供");
  }
  return Object.freeze({ robinrunBuiltinFilePath, personalFilePath });
}
