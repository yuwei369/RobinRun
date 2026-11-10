import type { RobinRunBackgroundTaskControlItem } from "./background-task-controls.js";

export function mergeRobinRunBackgroundTaskControlItems(
  current: readonly RobinRunBackgroundTaskControlItem[],
  updates: readonly RobinRunBackgroundTaskControlItem[],
): RobinRunBackgroundTaskControlItem[] {
  const jobsById = new Map(current.map((job) => [job.jobId, job] as const));
  for (const job of updates) {
    jobsById.set(job.jobId, job);
  }
  return Array.from(jobsById.values());
}
