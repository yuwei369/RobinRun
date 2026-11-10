import {
  robinrunProtocolMethods,
  robinrunPluginsReferenceCatalogResultSchema,
  type RobinRunPluginsReferenceCatalogParams,
} from "@robinrun/shared";
import type { RobinRunProtocolClient } from "#src/robinrun-agent/robinrunProtocolClient.js";

/** 旧协议严格校验响应；新展示字段走独立入口，只有 -32601 能证明旧 Agent 不支持。 */
export async function requestPluginReferenceCatalog(
  client: Pick<RobinRunProtocolClient, "request">,
  params: RobinRunPluginsReferenceCatalogParams,
) {
  try {
    return await client.request(
      robinrunProtocolMethods.pluginsReferenceCatalogWithCategory,
      params,
      robinrunPluginsReferenceCatalogResultSchema,
    );
  } catch (error) {
    if (!(typeof error === "object" && error !== null && "code" in error && error.code === -32601))
      throw error;
    return client.request(
      robinrunProtocolMethods.pluginsReferenceCatalog,
      params,
      robinrunPluginsReferenceCatalogResultSchema,
    );
  }
}
