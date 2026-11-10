import { z } from "zod";

/**
 * RobinRun agent 提供方的单一真源。
 *
 * 类型 RobinRunProvider、运行时 schema robinrunProviderSchema 都从这里派生,
 * 避免各处内联 z.enum([...]) 副本随新增/删除 provider 漂移。
 * 本模块只依赖 zod(叶子),可被 validation / robinrun-protocol 等无环引用。
 */
export const ROBINRUN_PROVIDERS = ["glm"] as const;

export const robinrunProviderSchema = z.enum(ROBINRUN_PROVIDERS);

export type RobinRunProvider = (typeof ROBINRUN_PROVIDERS)[number];
