import type { UiLocale, SupportedLocale } from "@robinrun/contracts";
import { enUS } from "./locales/en-US.js";
import { zhCN } from "./locales/zh-CN.js";
import {
  DEFAULT_LOCALE,
  detectLocale,
  isSupportedLocale,
  isUiLocale,
  resolveLocale,
  SUPPORTED_LOCALES,
} from "./locale.js";
import type { RobinRunCopy } from "./types.js";

export {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  detectLocale,
  isSupportedLocale,
  isUiLocale,
  resolveLocale,
};
export type { LocaleDetectionInput } from "./locale.js";
export type { CliCopy, TuiCopy, UiLocale, SupportedLocale, RobinRunCopy } from "./types.js";

const CATALOGS: Record<SupportedLocale, RobinRunCopy> = {
  "en-US": enUS,
  "zh-CN": zhCN,
};

export function getRobinRunCopy(locale?: UiLocale | string, detected?: string | null): RobinRunCopy {
  return CATALOGS[resolveLocale(locale, detected)];
}
