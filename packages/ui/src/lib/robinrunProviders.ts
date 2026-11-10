import {
  ROBINRUN_AGENT_PROVIDER,
  ROBINRUN_AGENT_PROVIDER_LABEL,
  type RobinRunProvider,
} from "@robinrun/shared";

export const ROBINRUN_AGENT_PROVIDERS: RobinRunProvider[] = [ROBINRUN_AGENT_PROVIDER];

export const ROBINRUN_AGENT_PROVIDER_LABELS: Record<RobinRunProvider, string> = {
  glm: ROBINRUN_AGENT_PROVIDER_LABEL,
};

export function supportsRobinRunSessionFork(provider: RobinRunProvider): boolean {
  void provider;
  // 功能开关：fork 入口恢复对所有 RobinRun provider 开放；实际可操作性仍由 task 状态、
  // assistant 目标和运行中保护 guard 控制，避免把 active/failed 分支暴露为可 fork。
  return true;
}

export function shouldHideRobinRunSessionForkAction(provider: RobinRunProvider): boolean {
  return !supportsRobinRunSessionFork(provider);
}
