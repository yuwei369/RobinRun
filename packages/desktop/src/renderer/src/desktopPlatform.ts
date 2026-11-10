import { recordArmsCustomEventForE2E } from "@robinrun/ui";
import {
  DesktopCommandIds,
  buildLocalMediaPreviewUrl,
  unwrapRemoteWorkspaceBindResult,
  type IPlatformService,
} from "@robinrun/shared";

import { desktopBrowserPlatformBridge } from "./desktopBrowserPlatformBridge.js";
import { createDesktopPluginSandboxPlatform } from "./plugin-sandbox/desktopPluginSandboxPlatform.js";

export function createDesktopPlatform(options: {
  isLocalDevelopmentRuntime: boolean;
}): IPlatformService {
  return {
    canSelectFilePath: true,
    canOpenLocalFiles: true,
    pluginSandbox: createDesktopPluginSandboxPlatform(),
    createLocalMediaPreviewUrl: buildLocalMediaPreviewUrl,
    isLocalDevelopmentRuntime: options.isLocalDevelopmentRuntime,
    selectDirectory: () => window.robinrun.selectDirectory(),
    selectDirectories: () => window.robinrun.selectDirectories(),
    selectFile: () => window.robinrun.selectFile(),
    selectFiles: () => window.robinrun.selectFiles?.() ?? Promise.resolve([]),
    createTempTextAttachment: (payload) => window.robinrun.createTempTextAttachment(payload),
    materializeWorkflowArtifactFile: (payload) =>
      window.robinrun.materializeWorkflowArtifactFile(payload),
    onRemoteConnectionLog: (handler) => window.robinrun.onRemoteConnectionLog(handler),
    onRemoteSessionClosed: (handler) => window.robinrun.onRemoteSessionClosed(handler),
    // Source 自动重连会替换 logical session；统一由 preload bridge 转发换代事件。
    onRemoteSessionReconnected: (handler) =>
      window.robinrun.onRemoteSessionReconnected?.(handler) ?? (() => {}),
    activateOrSetWorkspace: (path) =>
      window.robinrun.activateOrSetWorkspace?.(path) ?? Promise.resolve({ activated: false }),
    connectRemote: (remoteOptions, requestId, context) =>
      window.robinrun.connectRemote(remoteOptions, requestId, context),
    requestSourceSettingsAttachment: (sourceServerId) =>
      window.robinrun.requestSourceSettingsAttachment?.(sourceServerId) ??
      Promise.reject(new Error("Source settings attachment bridge unavailable")),
    cancelPendingRemoteConnection: (requestId) =>
      window.robinrun.cancelPendingRemoteConnection?.(requestId) ?? Promise.resolve(),
    bindRemoteWorkspaceSessionContext: async (context) => {
      if (!window.robinrun.bindRemoteWorkspaceSessionContext) {
        throw new Error("Desktop bindRemoteWorkspaceSessionContext bridge unavailable");
      }
      // preload 返回结构化结果，在页面一侧还原错误才能保留 code/retryable。
      return unwrapRemoteWorkspaceBindResult(
        await window.robinrun.bindRemoteWorkspaceSessionContext(context),
      );
    },
    startWebRemoteControl: (context) => window.robinrun.startWebRemoteControl(context),
    stopWebRemoteControl: () => window.robinrun.stopWebRemoteControl(),
    getWebRemoteControlStatus: () => window.robinrun.getWebRemoteControlStatus(),
    onWebRemoteControlStatusChanged: (handler) =>
      window.robinrun.onWebRemoteControlStatusChanged?.(handler) ?? (() => {}),
    disposeRemoteSession: (sessionId) => window.robinrun.disposeRemoteSession(sessionId),
    isDockerAvailable: () => window.robinrun.isDockerAvailable(),
    listWSLDistros: () => window.robinrun.listWSLDistros(),
    listDockerContainers: () => window.robinrun.listDockerContainers(),
    listSSHConfigAliases: () => window.robinrun.listSSHConfigAliases(),
    loadMcpFromUserDirectory: (payload) => window.robinrun.loadMcpFromUserDirectory(payload),
    saveMcpToUserDirectory: (payload) => window.robinrun.saveMcpToUserDirectory(payload),
    migrateLegacyCommonMcp: (payload) => window.robinrun.migrateLegacyCommonMcp(payload),
    openExternal: (url) => window.robinrun.openExternal(url),
    openFeedback: () => window.robinrun.executeDesktopCommand(DesktopCommandIds.OpenFeedback),
    openCommunity: () => window.robinrun.executeDesktopCommand(DesktopCommandIds.OpenCommunity),
    canOpenCommunity: (locale) => window.robinrun.canOpenCommunity(locale),
    openInFileManager: (path) => window.robinrun.openInFileManager(path),
    openExternalFile: (path) => window.robinrun.openExternalFile(path),
    openCuaPermissionOnboarding: window.robinrun.openCuaPermissionOnboarding
      ? (permissionOptions) =>
          window.robinrun.openCuaPermissionOnboarding?.(permissionOptions) ??
          Promise.resolve({ success: false, error: "not_supported" })
      : undefined,
    prepareCuaHelperPermissionDrag: window.robinrun.prepareCuaHelperPermissionDrag
      ? () =>
          window.robinrun.prepareCuaHelperPermissionDrag?.() ??
          Promise.resolve({ success: false, error: "not_supported" })
      : undefined,
    startCuaHelperPermissionDrag: window.robinrun.startCuaHelperPermissionDrag
      ? () => window.robinrun.startCuaHelperPermissionDrag?.()
      : undefined,
    notifyWebRemoteControlAuthStateChanged: (change) =>
      window.robinrun.notifyWebRemoteControlAuthStateChanged(change),
    registerOAuthState: (payload) => window.robinrun.registerOAuthState(payload),
    onOAuthCallback: (callback) => window.robinrun.onOAuthCallback(callback),
    onPaymentCallback: (callback) => window.robinrun.onPaymentCallback(callback),
    onShareImport: (callback) => window.robinrun.onShareImport?.(callback) ?? (() => {}),
    notifyRendererReady: () => window.robinrun.notifyRendererReady(),
    syncTelemetryContext: (context) => window.robinrun.syncTelemetryContext(context),
    reportTelemetryEvent: (payload) => window.robinrun.reportTelemetryEvent(payload),
    reportArmsCustomEvent: (payload) => {
      recordArmsCustomEventForE2E(payload);
      return window.robinrun.reportArmsCustomEvent(payload);
    },
    getRendererActionTraceConfig: window.robinrun.getRendererActionTraceConfig
      ? () => window.robinrun.getRendererActionTraceConfig!()
      : undefined,
    onRendererActionTraceConfigChanged: window.robinrun.onRendererActionTraceConfigChanged
      ? (callback) => window.robinrun.onRendererActionTraceConfigChanged!(callback)
      : undefined,
    reportLocalTtftBatch: (batch) => window.robinrun.reportLocalTtftBatch(batch),
    reportRendererActionTraceBatch: window.robinrun.reportRendererActionTraceBatch
      ? (batch) => window.robinrun.reportRendererActionTraceBatch!(batch)
      : undefined,
    reportRendererHeapSample: window.robinrun.reportRendererHeapSample
      ? (sample) => window.robinrun.reportRendererHeapSample!(sample)
      : undefined,
    showTaskNotification: (payload) => window.robinrun.showTaskNotification(payload),
    syncWindowTabs: (paths) => window.robinrun.syncWindowTabs(paths),
    syncWebRemoteControlWorkspaces: (workspaces) =>
      window.robinrun.syncWebRemoteControlWorkspaces?.(workspaces),
    onWebRemoteControlReconnectWorkspace: (handler) =>
      window.robinrun.onWebRemoteControlReconnectWorkspace?.(handler) ?? (() => {}),
    onWebRemoteControlRendererAction: (handler) =>
      window.robinrun.onWebRemoteControlRendererAction?.(handler) ?? (() => {}),
    syncWindowUnreadCount: (count) => window.robinrun.syncWindowUnreadCount(count),
    syncActiveTaskSession: (sessionId) => window.robinrun.syncActiveTaskSession(sessionId),
    syncAppSettings: (patch) => window.robinrun.syncAppSettings?.(patch),
    // 桥缺失（旧 preload 升级窗口）时按 supported 兜底，与 Windows 现状一致，设置开关可用。
    getCloseToTrayCapability: () =>
      window.robinrun.getCloseToTrayCapability?.() ??
      Promise.resolve({ supported: true, gnomeLikeWithoutTray: false }),
    setShortcutRecordingActive: (active) => window.robinrun.setShortcutRecordingActive?.(active),
    onFocusTab: (handler) => window.robinrun.onFocusTab(handler),
    onNewTab: (handler) => window.robinrun.onNewTab(handler),
    onCloseActiveContextRequest: (handler) =>
      window.robinrun.onCloseActiveContextRequest?.(handler) ?? (() => {}),
    onOpenBrowserUrl: (handler) => window.robinrun.onOpenBrowserUrl?.(handler) ?? (() => {}),
    onEmbeddedBrowserPermissionPrompt: (handler) =>
      window.robinrun.onEmbeddedBrowserPermissionPrompt?.(handler) ?? (() => {}),
    resolveEmbeddedBrowserPermissionPrompt: (request) =>
      window.robinrun.resolveEmbeddedBrowserPermissionPrompt?.(request),
    getEmbeddedBrowserSitePermissions: () =>
      window.robinrun.getEmbeddedBrowserSitePermissions?.() ?? Promise.resolve({}),
    setEmbeddedBrowserSitePermission: (request) =>
      window.robinrun.setEmbeddedBrowserSitePermission?.(request) ?? Promise.resolve({}),
    clearEmbeddedBrowserSitePermissions: () =>
      window.robinrun.clearEmbeddedBrowserSitePermissions?.() ?? Promise.resolve({}),
    resetEmbeddedBrowserSitePermission: (request) =>
      window.robinrun.resetEmbeddedBrowserSitePermission?.(request) ?? Promise.resolve({}),
    onBrowserViewScreenshotSurfacePrepare: (handler) =>
      window.robinrun.onBrowserViewScreenshotSurfacePrepare?.(handler) ?? (() => {}),
    onBrowserViewScreenshotSurfaceRelease: (handler) =>
      window.robinrun.onBrowserViewScreenshotSurfaceRelease?.(handler) ?? (() => {}),
    browserViewScreenshotSurfaceReady: (payload) =>
      window.robinrun.browserViewScreenshotSurfaceReady?.(payload),
    ...desktopBrowserPlatformBridge,
    onNewTask: (handler) => window.robinrun.onNewTask(handler),
    onOpenWorkspace: (handler) => {
      // 开发态或升级后的旧窗口可能仍运行未暴露 onOpenWorkspace 的 preload，
      // renderer 直接调用会在启动时崩溃。这里和 activateOrSetWorkspace 一样做兼容兜底，
      // 缺少该 bridge 时只禁用原生菜单回调，不影响应用继续打开。
      return window.robinrun.onOpenWorkspace?.(handler) ?? (() => {});
    },
    onOpenWorkspacePath: (handler) => window.robinrun.onOpenWorkspacePath?.(handler) ?? (() => {}),
    onOpenFeedbackDialog: (handler) => window.robinrun.onOpenFeedbackDialog?.(handler) ?? (() => {}),
    onOpenTicketsPanel: (handler) => window.robinrun.onOpenTicketsPanel?.(handler) ?? (() => {}),
    onWindowFullscreenChanged: (handler) => window.robinrun.onWindowFullscreenChanged(handler),
    getDesktopWindowChromeState: window.robinrun.getDesktopWindowChromeState
      ? () => window.robinrun.getDesktopWindowChromeState!()
      : undefined,
    onDesktopWindowChromeStateChanged: window.robinrun.onDesktopWindowChromeStateChanged
      ? (handler) => window.robinrun.onDesktopWindowChromeStateChanged!(handler)
      : undefined,
    getWindowControlsOverlayMetrics: () => window.robinrun.getWindowControlsOverlayMetrics?.() ?? null,
    onWindowControlsOverlayChanged: (handler) =>
      window.robinrun.onWindowControlsOverlayChanged?.(handler) ?? (() => {}),
    getDesktopZoomLevel: () =>
      window.robinrun.getDesktopZoomLevel?.() ?? Promise.resolve({ zoomLevel: 0 }),
    onDesktopZoomLevelChanged: (handler) =>
      window.robinrun.onDesktopZoomLevelChanged?.(handler) ?? (() => {}),
    onTaskNotificationClick: (handler) => window.robinrun.onTaskNotificationClick(handler),
    exportLogs: () => window.robinrun.exportLogs(),
    captureWindowScreenshot: () =>
      window.robinrun.captureWindowScreenshot?.() ?? Promise.resolve(null),
    onUpdateReady: (callback) => window.robinrun.onUpdateReady(callback),
    onUpdateCheckResult: (callback) => window.robinrun.onUpdateCheckResult(callback),
    onUpdateStateChanged: (callback) => window.robinrun.onUpdateStateChanged?.(callback) ?? (() => {}),
    getUpdateState: () =>
      window.robinrun.getUpdateState?.() ?? Promise.resolve({ kind: "idle", enabled: true }),
    downloadUpdate: () => window.robinrun.downloadUpdate?.() ?? Promise.resolve(),
    cancelUpdateDownload: () => window.robinrun.cancelUpdateDownload?.() ?? Promise.resolve(),
    openUpdateStatusWindow: () => window.robinrun.openUpdateStatusWindow?.() ?? Promise.resolve(),
    getAutoUpdatePreferences: () =>
      window.robinrun.getAutoUpdatePreferences?.() ??
      Promise.resolve({ autoDownloadAndInstallUpdates: false }),
    setAutoDownloadAndInstallUpdates: (enabled) =>
      window.robinrun.setAutoDownloadAndInstallUpdates?.(enabled) ?? Promise.resolve(),
    getDesktopSessionActivity: () =>
      window.robinrun.getDesktopSessionActivity?.() ??
      Promise.resolve({ runningAgentSessionCount: 0 }),
    getRobinRunStdioTapDevState: () =>
      window.robinrun.getRobinRunStdioTapDevState?.() ??
      Promise.resolve({ enabled: false, visible: false, logDir: "", statePath: "" }),
    onSettingsChanged: (callback) => window.robinrun.onSettingsChanged?.(callback) ?? (() => {}),
    onApplicationLocaleChanged: (callback) =>
      window.robinrun.onApplicationLocaleChanged?.(callback) ?? (() => {}),
    onPostUpdateReleaseNotes: (callback) => window.robinrun.onPostUpdateReleaseNotes(callback),
    acknowledgePostUpdateReleaseNotes: (version) =>
      window.robinrun.acknowledgePostUpdateReleaseNotes(version),
    skipUpdateVersion: (version) => window.robinrun.skipUpdateVersion?.(version) ?? Promise.resolve(),
    quitAndInstallUpdate: () => window.robinrun.quitAndInstallUpdate(),
    getInstalledEditors: (filePath) => window.robinrun.getInstalledEditors(filePath),
    getFileApplications: (target) => window.robinrun.getFileApplications(target),
    openFileWithApplication: (applicationId, target) =>
      window.robinrun.openFileWithApplication(applicationId, target),
    getApplicationIcon: (bundleId) =>
      window.robinrun.getApplicationIcon?.(bundleId) ?? Promise.resolve(null),
    openInEditor: (editorId, path, editorOptions) =>
      window.robinrun.openInEditor(editorId, path, editorOptions),
    executeDesktopCommand: (command) => window.robinrun.executeDesktopCommand(command),
    setApplicationLocale: (locale) => window.robinrun.setApplicationLocale(locale),
    getSystemLocale: () =>
      window.robinrun.getSystemLocale?.() ??
      Promise.resolve(navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en-US"),
    setTitleBarTheme: (theme) => window.robinrun.setTitleBarTheme(theme),
    getDeviceId: () =>
      (window as Window & { __ROBINRUN_DEVICE_ID__?: string }).__ROBINRUN_DEVICE_ID__ ?? "",
  };
}
