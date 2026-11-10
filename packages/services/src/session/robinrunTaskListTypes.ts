import type { WorkspacePurpose, RobinRunTaskMeta } from "@robinrun/shared";

export type RobinRunTaskListKind = "pinned" | "archived" | "timeline" | "active";
export type RobinRunTaskListSortBy = "created" | "updated";

export interface RobinRunTaskListWorkspaceScope {
  workspacePath: string;
  workspaceIdentity?: string;
  workspacePurpose?: WorkspacePurpose;
}

export interface RobinRunTaskListQuery {
  kind: RobinRunTaskListKind | "all";
  /** host 由存储 owner 确定全部范围，不接受 UI 已打开工作区作为历史目录。 */
  workspaceScopes: RobinRunTaskListWorkspaceScope[] | "host";
  sortBy: RobinRunTaskListSortBy;
  search?: string;
  limit?: number;
}

export type RobinRunTaskListItem = RobinRunTaskMeta & {
  searchSnippet?: string;
  searchSnippets?: string[];
};

export interface RobinRunTaskListResult {
  items: RobinRunTaskListItem[];
  total: number;
  hasMore: boolean;
}

export interface RobinRunWorkspaceEventSubscriptionParams {
  workspacePath: string;
  workspaceIdentity?: string;
}
