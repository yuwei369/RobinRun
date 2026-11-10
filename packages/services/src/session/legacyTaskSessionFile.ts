import type { RobinRunSessionFile, RobinRunTaskMeta } from "@robinrun/shared";
import { robinrunSessionFileSchema, robinrunTaskMetaSchema, robinrunTaskModeSchema } from "@robinrun/shared";

export type LegacyTaskSessionFile = Omit<RobinRunSessionFile, "meta"> & {
  meta: Omit<RobinRunTaskMeta, "mode"> & { mode?: RobinRunTaskMeta["mode"] };
};

const legacyTaskSessionFileSchema = robinrunSessionFileSchema.extend({
  // Claude 原生迁移会按清洗路径删除 meta.mode。
  // legacy snapshot 读取/写入仍要校验其它必需字段，但不能再强制把被过滤字段补回文件。
  meta: robinrunTaskMetaSchema.extend({
    mode: robinrunTaskModeSchema.optional(),
  }),
});

export function parseLegacyTaskSessionFile(input: unknown): LegacyTaskSessionFile {
  return legacyTaskSessionFileSchema.parse(input);
}

export function safeParseLegacyTaskSessionFile(input: unknown) {
  return legacyTaskSessionFileSchema.safeParse(input);
}
