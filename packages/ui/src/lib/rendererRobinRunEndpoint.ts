import {
  buildRuntimeRobinRunEndpointUrls,
  ROBINRUN_ENV,
  type RuntimeRobinRunEndpointEnv,
} from "@robinrun/shared";

interface RendererImportMetaEnv {
  VITE_ROBINRUN_BASE_URL?: string;
  VITE_ROBINRUN_ENDPOINT_ORIGIN?: string;
}

function readRendererImportMetaEnv(): RendererImportMetaEnv {
  return ((import.meta as ImportMeta & { env?: RendererImportMetaEnv }).env ??
    {}) as RendererImportMetaEnv;
}

export function createRendererRobinRunEndpointEnv(
  env: RendererImportMetaEnv = readRendererImportMetaEnv(),
): RuntimeRobinRunEndpointEnv {
  return {
    ROBINRUN_ENV,
    // UI 侧的 robinrun-plan 占位 provider 以前只看 ROBINRUN_ENV，
    // 没有消费 Vite 注入的 base url，导致自定义测试域名时 renderer 和 host/service 可能不一致。
    ROBINRUN_BASE_URL: env.VITE_ROBINRUN_BASE_URL,
    ROBINRUN_ENDPOINT_ORIGIN: env.VITE_ROBINRUN_ENDPOINT_ORIGIN,
  };
}

export const RENDERER_ROBINRUN_ENDPOINT_URLS = buildRuntimeRobinRunEndpointUrls(
  createRendererRobinRunEndpointEnv(),
);
