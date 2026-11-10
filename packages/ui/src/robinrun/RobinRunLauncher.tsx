import { useCallback, useMemo, useState } from "react";
import type { RobinRunProjectEntry } from "@robinrun/shared";
import { useSettings } from "@/hooks/useSettingService.js";
import { usePlatform } from "@/hooks/usePlatform.js";
import { useRobinRunIntl } from "@/i18n/IntlProvider.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { logger } from "@/logger.js";

/**
 * RobinRunLauncher —— 项目启动台
 *
 * RobinRun 的冷启动入口：进入程序先创建或选择一个运营项目，项目独占主界面。
 * 项目注册表持久化在 AppSettings.robinrunProjects（setting.json），路径同时作为
 * workspace identity 的本地键。项目打开复用 Root 的 handleSelectProject 链路。
 */

function basenameOf(path: string): string {
  const normalized = path.replace(/[\\/]+$/, "");
  const segments = normalized.split(/[\\/]/);
  return segments[segments.length - 1] || normalized;
}

export interface RobinRunLauncherProps {
  /** 打开已注册/新选中的项目工作空间（Root 的 handleSelectProject）。 */
  onOpenProject: (path: string) => void;
  /** 现有的"打开文件夹"入口（含远程/浏览器目录浏览等既有逻辑）。 */
  onOpenWorkspaceViaPicker: () => void;
}

export function RobinRunLauncher({ onOpenProject, onOpenWorkspaceViaPicker }: RobinRunLauncherProps) {
  const { intl } = useRobinRunIntl();
  const platform = usePlatform();
  const { settings, loading, update } = useSettings();

  const [creating, setCreating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projects = useMemo(() => {
    const list = settings?.robinrunProjects ?? [];
    return [...list].sort((a, b) => b.lastOpenedAt - a.lastOpenedAt);
  }, [settings?.robinrunProjects]);

  const registerAndOpen = useCallback(
    async (path: string, name: string) => {
      const current = settings?.robinrunProjects ?? [];
      const existing = current.find((p) => p.path === path);
      const now = Date.now();
      const next: RobinRunProjectEntry[] = existing
        ? current.map((p) => (p.id === existing.id ? { ...p, lastOpenedAt: now, name } : p))
        : [
            ...current,
            {
              id: crypto.randomUUID(),
              name,
              path,
              createdAt: now,
              lastOpenedAt: now,
            },
          ];
      await update({ robinrunProjects: next });
      onOpenProject(path);
    },
    [onOpenProject, settings?.robinrunProjects, update],
  );

  const handleOpenProject = useCallback(
    async (entry: RobinRunProjectEntry) => {
      if (busy) return;
      setBusy(true);
      setError(null);
      try {
        const current = settings?.robinrunProjects ?? [];
        await update({
          robinrunProjects: current.map((p) =>
            p.id === entry.id ? { ...p, lastOpenedAt: Date.now() } : p,
          ),
        });
        onOpenProject(entry.path);
      } catch (cause) {
        logger.warn("[RobinRunLauncher] open project failed:", cause);
        setError(intl.formatMessage({ id: "robinrun.launcher.errorOpen" }));
      } finally {
        setBusy(false);
      }
    },
    [busy, intl, onOpenProject, settings?.robinrunProjects, update],
  );

  const handlePickDirectory = useCallback(async () => {
    setError(null);
    try {
      return await platform.selectDirectory();
    } catch (cause) {
      logger.warn("[RobinRunLauncher] select directory failed:", cause);
      return null;
    }
  }, [platform]);

  const handleCreate = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const path = await handlePickDirectory();
      if (!path) return;
      const name = projectName.trim() || basenameOf(path);
      await registerAndOpen(path, name);
    } catch (cause) {
      logger.warn("[RobinRunLauncher] create project failed:", cause);
      setError(intl.formatMessage({ id: "robinrun.launcher.errorCreate" }));
    } finally {
      setBusy(false);
    }
  }, [busy, handlePickDirectory, intl, projectName, registerAndOpen]);

  const handleOpenExistingFolder = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const path = await handlePickDirectory();
      if (!path) return;
      await registerAndOpen(path, basenameOf(path));
    } catch (cause) {
      logger.warn("[RobinRunLauncher] open folder failed:", cause);
      setError(intl.formatMessage({ id: "robinrun.launcher.errorOpen" }));
    } finally {
      setBusy(false);
    }
  }, [busy, handlePickDirectory, intl, registerAndOpen]);

  const handleRemoveProject = useCallback(
    async (id: string) => {
      const current = settings?.robinrunProjects ?? [];
      try {
        await update({ robinrunProjects: current.filter((p) => p.id !== id) });
      } catch (cause) {
        logger.warn("[RobinRunLauncher] remove project failed:", cause);
      }
    },
    [settings?.robinrunProjects, update],
  );

  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-6">
      <div className="flex w-full max-w-2xl flex-col gap-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-ui-xl font-semibold text-foreground">
            {intl.formatMessage({ id: "robinrun.launcher.title" })}
          </h1>
          <p className="text-ui-sm text-muted-foreground">
            {intl.formatMessage({ id: "robinrun.launcher.subtitle" })}
          </p>
        </div>

        <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
          {loading ? (
            <p className="text-ui-sm text-muted-foreground">
              {intl.formatMessage({ id: "robinrun.launcher.loading" })}
            </p>
          ) : projects.length === 0 ? (
            <p className="text-ui-sm text-muted-foreground">
              {intl.formatMessage({ id: "robinrun.launcher.empty" })}
            </p>
          ) : (
            projects.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2"
              >
                <button
                  type="button"
                  className="flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-md text-left"
                  disabled={busy}
                  onClick={() => void handleOpenProject(entry)}
                >
                  <span className="truncate text-ui-base font-medium text-foreground">
                    {entry.name}
                  </span>
                  <span className="truncate text-ui-xs text-muted-foreground">{entry.path}</span>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={() => void handleOpenProject(entry)}
                >
                  {intl.formatMessage({ id: "robinrun.launcher.open" })}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  title={intl.formatMessage({ id: "robinrun.launcher.remove" })}
                  onClick={() => void handleRemoveProject(entry.id)}
                >
                  ✕
                </Button>
              </div>
            ))
          )}
        </div>

        {error ? <p className="text-ui-sm text-destructive">{error}</p> : null}

        {creating ? (
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
            <label className="flex flex-col gap-1">
              <span className="text-ui-sm text-foreground">
                {intl.formatMessage({ id: "robinrun.launcher.nameLabel" })}
              </span>
              <Input
                value={projectName}
                placeholder={intl.formatMessage({ id: "robinrun.launcher.namePlaceholder" })}
                onChange={(event) => setProjectName(event.target.value)}
              />
              <span className="text-ui-xs text-muted-foreground">
                {intl.formatMessage({ id: "robinrun.launcher.nameHint" })}
              </span>
            </label>
            <div className="flex items-center gap-2">
              <Button disabled={busy} onClick={() => void handleCreate()}>
                {intl.formatMessage({ id: "robinrun.launcher.createConfirm" })}
              </Button>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => {
                  setCreating(false);
                  setProjectName("");
                }}
              >
                {intl.formatMessage({ id: "robinrun.launcher.cancel" })}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setCreating(true)}>
              {intl.formatMessage({ id: "robinrun.launcher.create" })}
            </Button>
            <Button variant="outline" disabled={busy} onClick={() => void handleOpenExistingFolder()}>
              {intl.formatMessage({ id: "robinrun.launcher.openFolder" })}
            </Button>
            <Button variant="ghost" onClick={onOpenWorkspaceViaPicker}>
              {intl.formatMessage({ id: "robinrun.launcher.advancedOpen" })}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
