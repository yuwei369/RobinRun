import { buildRuntimeRobinRunApiUrl, resolveZaiBusinessBaseUrl } from "@robinrun/shared";

export const ROBINRUN_CLIENT_SCENES_URL = buildRuntimeRobinRunApiUrl(
  process.env,
  "/api/v1/client/scenes",
);

export const ZAI_API_HOST = resolveZaiBusinessBaseUrl(process.env);
