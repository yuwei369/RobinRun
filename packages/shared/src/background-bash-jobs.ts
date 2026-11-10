import {
  collectVisibleRobinRunBackgroundTaskControlItems,
  getRobinRunBackgroundTaskControlItemElapsedMs,
  isActiveRobinRunBackgroundTaskControlItem,
  parseRobinRunBackgroundTaskControlItems,
  type RobinRunBackgroundTaskControlItem,
  type RobinRunBackgroundTaskControlStatus,
} from "./background-task-controls.js";

export type RobinRunBackgroundBashJobStatus = RobinRunBackgroundTaskControlStatus;
export type RobinRunBackgroundBashJob = RobinRunBackgroundTaskControlItem & {
  taskKind: "bash";
};

export function parseRobinRunBackgroundBashJobs(value: unknown): RobinRunBackgroundBashJob[] {
  return parseRobinRunBackgroundTaskControlItems(value).filter(isBackgroundBashJob);
}

export function isActiveRobinRunBackgroundBashJob(job: RobinRunBackgroundBashJob): boolean {
  return isActiveRobinRunBackgroundTaskControlItem(job);
}

export function getRobinRunBackgroundBashJobElapsedMs(
  job: RobinRunBackgroundBashJob,
  now = Date.now(),
): number {
  return getRobinRunBackgroundTaskControlItemElapsedMs(job, now);
}

export function collectVisibleRobinRunBackgroundBashJobs(
  jobs: readonly RobinRunBackgroundBashJob[],
  now = Date.now(),
  thresholdMs = 30_000,
): Array<RobinRunBackgroundBashJob & { elapsedMs: number }> {
  return collectVisibleRobinRunBackgroundTaskControlItems(jobs, now, thresholdMs) as Array<
    RobinRunBackgroundBashJob & { elapsedMs: number }
  >;
}

function isBackgroundBashJob(job: RobinRunBackgroundTaskControlItem): job is RobinRunBackgroundBashJob {
  return job.taskKind === "bash";
}
