const ROBINRUN_PROCESS_PREFIX = "robinrun";
const MAX_PROCESS_NAME_SEGMENT_LENGTH = 24;

function sanitizeProcessNameSegment(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!normalized) {
    return null;
  }

  return normalized.slice(0, MAX_PROCESS_NAME_SEGMENT_LENGTH);
}

function joinRobinRunProcessName(...segments: Array<string | null | undefined>): string {
  const sanitizedSegments = segments
    .map((segment) => sanitizeProcessNameSegment(segment))
    .filter((segment): segment is string => Boolean(segment));
  return [ROBINRUN_PROCESS_PREFIX, ...sanitizedSegments].join("-");
}

function pickWorkspaceTag(workspacePath: string | null | undefined): string | undefined {
  const trimmedPath = workspacePath?.trim();
  if (!trimmedPath) {
    return undefined;
  }

  const parts = trimmedPath.split(/[\\/]+/).filter(Boolean);
  return parts.at(-1) ?? trimmedPath;
}

export function formatRobinRunMainProcessName(): string {
  return joinRobinRunProcessName("main");
}

export function formatRobinRunGpuProcessName(): string {
  return joinRobinRunProcessName("gpu");
}

export function formatRobinRunHostProcessName(label?: string): string {
  return joinRobinRunProcessName("host", label);
}

export function formatRobinRunRendererProcessName(windowTitle?: string): string {
  const normalizedTitle = windowTitle?.trim();
  if (!normalizedTitle || normalizedTitle === "RobinRun") {
    return joinRobinRunProcessName("renderer", "main");
  }

  if (normalizedTitle === "Resource Manager") {
    return joinRobinRunProcessName("renderer", "resource-manager");
  }

  const remoteWindowPrefix = "RobinRun - ";
  if (normalizedTitle.startsWith(remoteWindowPrefix)) {
    return joinRobinRunProcessName(
      "renderer",
      "remote",
      normalizedTitle.slice(remoteWindowPrefix.length),
    );
  }

  return joinRobinRunProcessName("renderer", normalizedTitle);
}

export function formatRobinRunAgentProcessName(provider: string, workspacePath?: string): string {
  return joinRobinRunProcessName("agent", provider, pickWorkspaceTag(workspacePath));
}

export function formatRobinRunUtilityProcessName(name?: string, type = "utility"): string {
  return joinRobinRunProcessName(type, name);
}
