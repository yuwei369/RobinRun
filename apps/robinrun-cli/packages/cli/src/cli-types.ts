import type { TuiReadClipboardImage, TuiWriteClipboardText } from "@robinrun/tui";
import type { UiLocale } from "@robinrun/i18n";
import type { Logger } from "@robinrun/contracts";
import type {
  createManagedCdpBrowserRuntime,
  ManagedCdpBrowserRuntimeOptions,
} from "@robinrun/adapters/browser";
import type {
  createDefaultProviderEndpointRoutingPort,
  createModelAdapter,
  createRobinRunApp,
  CreateDefaultProviderEndpointRoutingPortOptions,
  CreateModelAdapterOptions,
  configureCodingPlanApiKey,
  ConfigureCodingPlanApiKeyOptions,
  inspectRobinRunSkill,
  inspectWorkspaceHookTrust,
  grantWorkspaceHookTrust,
  revokeWorkspaceHookTrustCli,
  inspectRobinRunCustomCommand,
  InspectRobinRunCustomCommandOptions,
  InspectRobinRunSkillOptions,
  loginRobinRunCli,
  loginBigmodelCodingPlan,
  LoginBigmodelCodingPlanOptions,
  LoginRobinRunCliOptions,
  listRobinRunCustomCommands,
  ListRobinRunCustomCommandsOptions,
  loadRobinRunCustomCommand,
  listRobinRunSessions,
  listRobinRunSkills,
  ListRobinRunSessionsOptions,
  ListRobinRunSkillsOptions,
  logoutRobinRunCli,
  LogoutRobinRunCliOptions,
  resolveLatestSession,
  ResolveLatestSessionOptions,
  RunRobinRunProtocolAgentOptions,
  prepareRobinRunTelemetryEnv,
  startProcessProviderRegistryRuntime,
  shutdownRobinRunTelemetry,
  RobinRunAppOptions,
} from "@robinrun/bootstrap";
import type { CliEnv, DotenvLoadResult, LoadCliDotenvOptions } from "./env.js";
import type { PluginsCommandOverrides } from "./plugins-command.js";
import type { CliShutdownProcess } from "./shutdown.js";
import type { resolveWorkspaceGitBranch } from "./tui-workspace-git.js";

export type BootstrapModule = typeof import("@robinrun/bootstrap");

export interface RunDependencies extends PluginsCommandOverrides {
  migrateStorage?: () => Promise<import("@robinrun/shared/sqlite-migrations").MigrationResult>;
  protocolLifecycle?: RunRobinRunProtocolAgentOptions["lifecycle"];
  protocolInput?: NodeJS.ReadableStream;
  createManagedCdpBrowserRuntime?: (
    options?: ManagedCdpBrowserRuntimeOptions,
  ) => ReturnType<typeof createManagedCdpBrowserRuntime>;
  createModelAdapter?: (
    options?: CreateModelAdapterOptions,
  ) => ReturnType<typeof createModelAdapter>;
  createProviderEndpointRoutingPort?: (
    options: CreateDefaultProviderEndpointRoutingPortOptions,
  ) => ReturnType<typeof createDefaultProviderEndpointRoutingPort>;
  createRobinRunApp?: (
    options?: RobinRunAppOptions,
  ) => Awaited<ReturnType<typeof createRobinRunApp>> | ReturnType<typeof createRobinRunApp>;
  /**
   * Session-event shaper for --output-format stream-json. Defaults to the
   * bootstrap module's, which is also what the protocol server uses; injectable
   * so a caller that supplies its own `createRobinRunApp` (tests, embedders) can
   * still stream, since the bootstrap module is not loaded on that path.
   */
  mapSessionEvent?: BootstrapModule["mapSessionEvent"];
  cwd?: () => string;
  env?: CliEnv;
  inspectSkill?: (options: InspectRobinRunSkillOptions) => ReturnType<typeof inspectRobinRunSkill>;
  inspectWorkspaceHookTrust?: typeof inspectWorkspaceHookTrust;
  grantWorkspaceHookTrust?: typeof grantWorkspaceHookTrust;
  revokeWorkspaceHookTrustCli?: typeof revokeWorkspaceHookTrustCli;
  inspectCustomCommand?: (
    options: InspectRobinRunCustomCommandOptions,
  ) => ReturnType<typeof inspectRobinRunCustomCommand>;
  loginRobinRunCli?: (options?: LoginRobinRunCliOptions) => ReturnType<typeof loginRobinRunCli>;
  loginBigmodelCodingPlan?: (
    options?: LoginBigmodelCodingPlanOptions,
  ) => ReturnType<typeof loginBigmodelCodingPlan>;
  configureCodingPlanApiKey?: (
    options: ConfigureCodingPlanApiKeyOptions,
  ) => ReturnType<typeof configureCodingPlanApiKey>;
  loadDotenv?: (options?: LoadCliDotenvOptions) => DotenvLoadResult;
  prepareRobinRunTelemetryEnv?: typeof prepareRobinRunTelemetryEnv;
  projectConfigPath?: string;
  listSessions?: (options: ListRobinRunSessionsOptions) => ReturnType<typeof listRobinRunSessions>;
  listCustomCommands?: (
    options: ListRobinRunCustomCommandsOptions,
  ) => ReturnType<typeof listRobinRunCustomCommands>;
  loadCustomCommand?: (
    options: InspectRobinRunCustomCommandOptions,
  ) => ReturnType<typeof loadRobinRunCustomCommand>;
  // headless slash 路由要和 app facade 的保留名 gate 用同一个判据；默认取 bootstrap 的，
  // 注入点只为让单测不必拉起整个 bootstrap 模块。见 prompt-command.ts。
  isReservedSlashCommandName?: BootstrapModule["isReservedRobinRunSlashCommandName"];
  listSkills?: (options: ListRobinRunSkillsOptions) => ReturnType<typeof listRobinRunSkills>;
  logger?: Logger;
  readClipboardImage?: TuiReadClipboardImage;
  writeClipboardText?: TuiWriteClipboardText;
  resolveLatestSession?: (
    options: ResolveLatestSessionOptions,
  ) => ReturnType<typeof resolveLatestSession>;
  resolveWorkspaceGitBranch?: typeof resolveWorkspaceGitBranch;
  logoutRobinRunCli?: (options?: LogoutRobinRunCliOptions) => ReturnType<typeof logoutRobinRunCli>;
  runRobinRunProtocolAgent?: (options?: RunRobinRunProtocolAgentOptions) => Promise<void>;
  runTui?: typeof import("@robinrun/tui").runTui;
  skipUserConfig?: boolean;
  userConfigPath?: string;
  exitProcess?: (code: number) => void;
  shutdownCleanupTimeoutMs?: number;
  shutdownProcess?: CliShutdownProcess;
  startProcessProviderRegistryRuntime?: typeof startProcessProviderRegistryRuntime;
  shutdownRobinRunTelemetry?: typeof shutdownRobinRunTelemetry;
}

export type CliPermissionMode = "build" | "plan" | "edit" | "yolo" | "guarded";
export type CliRuntimeMode = CliPermissionMode | "auto";

export interface CliModeState {
  current?: CliRuntimeMode;
  override?: CliPermissionMode;
}

export interface CliTargetRequest {
  objective: string;
  replaceExisting: boolean;
}

export type ModeCapableApp = Awaited<ReturnType<typeof createRobinRunApp>> & {
  getMode?: () => CliRuntimeMode;
  setLocale?: (locale: UiLocale) => Promise<{ locale: "en-US" | "zh-CN" }>;
  setMode?: (mode: CliRuntimeMode) => Promise<{ mode: CliRuntimeMode }>;
};

export interface CliResumeRequest {
  continueSession: boolean;
  resumeSessionId?: string;
}
