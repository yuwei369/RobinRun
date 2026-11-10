import { DEFAULT_ROBINRUN_ENDPOINT_ORIGIN } from "./robinrunEndpoint.js";

export const ROBINRUN_SOURCE_HEADERS = {
  "User-Agent": "RobinRun/unknown",
  "HTTP-Referer": DEFAULT_ROBINRUN_ENDPOINT_ORIGIN,
  "X-Title": "RobinRun@electron",
} as const;

export interface BuildRobinRunSourceHeadersFromContextOptions {
  appVersion?: string;
  arch?: string;
  clientLanguage?: string;
  clientTimezone?: string;
  deviceMid?: string;
  endpointOrigin?: string;
  osVersion?: string;
  platform?: string;
  releaseChannel?: string;
  sourceTitle?: string;
}

export function normalizeRobinRunSourceHeaderValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || !/^[\x20-\x7e]+$/.test(trimmed)) {
    return undefined;
  }
  return trimmed;
}

export function buildRobinRunSourceHeadersFromContext(
  options: BuildRobinRunSourceHeadersFromContextOptions = {},
): Record<string, string> {
  const appVersion = normalizeRobinRunSourceHeaderValue(options.appVersion);
  const arch = normalizeRobinRunSourceHeaderValue(options.arch);
  const clientLanguage = normalizeRobinRunSourceHeaderValue(options.clientLanguage) ?? "unknown";
  const clientTimezone = normalizeRobinRunSourceHeaderValue(options.clientTimezone) ?? "unknown";
  const deviceMid = normalizeRobinRunSourceHeaderValue(options.deviceMid);
  const endpointOrigin =
    normalizeRobinRunSourceHeaderValue(options.endpointOrigin) ?? DEFAULT_ROBINRUN_ENDPOINT_ORIGIN;
  const osVersion = normalizeRobinRunSourceHeaderValue(options.osVersion);
  const platform = normalizeRobinRunSourceHeaderValue(options.platform);
  const releaseChannel = normalizeRobinRunSourceHeaderValue(options.releaseChannel);
  const sourceTitle = normalizeRobinRunSourceHeaderValue(options.sourceTitle) ?? "electron";

  return {
    ...ROBINRUN_SOURCE_HEADERS,
    "HTTP-Referer": endpointOrigin,
    "User-Agent": `RobinRun/${appVersion ?? "unknown"}`,
    ...(appVersion ? { "X-RobinRun-App-Version": appVersion } : {}),
    "X-Title": `RobinRun@${sourceTitle}`,
    ...(platform && arch ? { "X-Platform": `${platform}-${arch}` } : {}),
    ...(releaseChannel ? { "X-Release-Channel": releaseChannel } : {}),
    "X-Client-Language": clientLanguage,
    "X-Client-Timezone": clientTimezone,
    ...(platform ? { "X-Os-Category": normalizeOsCategory(platform) } : {}),
    ...(osVersion ? { "X-Os-Version": osVersion } : {}),
    ...(deviceMid ? { "X-Device-Mid": deviceMid } : {}),
  };
}

function normalizeOsCategory(platform: string): string {
  switch (platform) {
    case "darwin":
      return "macos";
    case "win32":
      return "windows";
    default:
      return "linux";
  }
}
