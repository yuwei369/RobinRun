import type { RobinRunSessionStateSnapshot } from "@robinrun/shared";
import type {
  RobinRunSessionWorkspaceTarget,
  RobinRunTaskTarget,
} from "#src/robinrun-session/robinrunSession.js";

function getWorkspaceKey(target: RobinRunSessionWorkspaceTarget): string {
  return target.workspaceIdentity?.trim() || target.workspacePath;
}

function getSessionScopedKey(target: RobinRunTaskTarget): string {
  return `${getWorkspaceKey(target)}\0${target.sessionId}`;
}

export function createRobinRunDeferredDraftRegistry() {
  const sessionKeys = new Set<string>();

  return {
    remember(params: RobinRunSessionWorkspaceTarget, snapshot: RobinRunSessionStateSnapshot): void {
      sessionKeys.add(
        getSessionScopedKey({
          workspacePath: snapshot.session.workspace.workspacePath,
          workspaceIdentity:
            snapshot.session.workspace.workspaceIdentity ?? params.workspaceIdentity,
          sessionId: snapshot.session.sessionId,
        }),
      );
    },

    has(target: RobinRunTaskTarget): boolean {
      return sessionKeys.has(getSessionScopedKey(target));
    },

    forget(target: RobinRunTaskTarget): void {
      sessionKeys.delete(getSessionScopedKey(target));
    },
  };
}
