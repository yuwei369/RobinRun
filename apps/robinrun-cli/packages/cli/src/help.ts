import { getRobinRunCopy, type SupportedLocale, type UiLocale } from "@robinrun/i18n";

export function formatCliHelp(
  version: string,
  locale?: UiLocale,
  detectedLocale?: SupportedLocale,
): string {
  return getRobinRunCopy(locale, detectedLocale).cli.help(version);
}
