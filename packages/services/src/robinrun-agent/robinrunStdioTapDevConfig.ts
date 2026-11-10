import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { RobinRunStdioTapDevState } from "@robinrun/shared";
import { getAppConfigDir } from "#src/paths.js";
import { isEffectiveDevelopmentNodeEnv } from "#src/runtime-tools/nodeEnv.js";

interface RobinRunStdioTapStateFile {
  enabled?: boolean;
}

export function isRobinRunStdioTapDevVisible(): boolean {
  return isEffectiveDevelopmentNodeEnv();
}

export function getRobinRunStdioTapDevDir(): string {
  return join(getAppConfigDir(), "dev");
}

export function getRobinRunStdioTapDevLogDir(): string {
  return join(getRobinRunStdioTapDevDir(), "stdio-traffic");
}

export function getRobinRunStdioTapDevStatePath(): string {
  return join(getRobinRunStdioTapDevDir(), "robinrun-stdio-tap.json");
}

function readStateFile(path: string): RobinRunStdioTapStateFile {
  if (!existsSync(path)) {
    return {};
  }

  try {
    const parsed = JSON.parse(readFileSync(path, "utf-8")) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as RobinRunStdioTapStateFile) : {};
  } catch {
    return {};
  }
}

export function readRobinRunStdioTapDevState(): RobinRunStdioTapDevState {
  const visible = isRobinRunStdioTapDevVisible();
  const statePath = getRobinRunStdioTapDevStatePath();
  const fileState = readStateFile(statePath);
  return {
    enabled: visible && fileState.enabled === true,
    visible,
    logDir: getRobinRunStdioTapDevLogDir(),
    statePath,
  };
}

export function setRobinRunStdioTapDevEnabled(enabled: boolean): RobinRunStdioTapDevState {
  const visible = isRobinRunStdioTapDevVisible();
  const statePath = getRobinRunStdioTapDevStatePath();
  mkdirSync(getRobinRunStdioTapDevDir(), { recursive: true });
  writeFileSync(
    statePath,
    `${JSON.stringify(
      {
        // 开发态 stdio 抓包是高频原始协议帧，只能通过显式开关写旁路文件，避免误进生产日志。
        enabled: visible && enabled,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
  );
  return readRobinRunStdioTapDevState();
}
