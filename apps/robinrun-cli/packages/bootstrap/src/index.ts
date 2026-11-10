// Bootstrap public API surface.

export * from "./app/create-app.js";
export type {
  ListRobinRunSessionsOptions,
  PromptInput,
  ResolveLatestSessionOptions,
  ResumeOptions,
  RunRobinRunProtocolAgentOptions,
  SendInputOptions,
  SendInputResult,
  SetLocaleResult,
  SteerTurnOptions,
  SubmitPromptOptions,
  UserPromptInput,
  RobinRunApp,
  RobinRunAppOptions,
  RobinRunModelOption,
} from "./app/types.js";
export * from "./auth-login.js";
export {
  inspectRobinRunCustomCommand,
  listRobinRunCustomCommands,
  loadRobinRunCustomCommand,
} from "./custom-commands.js";
export type {
  InspectRobinRunCustomCommandOptions,
  ListRobinRunCustomCommandsOptions,
  RobinRunCustomCommandInspection,
} from "./custom-commands.js";
export { createModelAdapter } from "./model-factory.js";
export type { CreateModelAdapterOptions } from "./model-factory.js";
export {
  createDefaultProviderEndpointRoutingPort,
  resolveProcessProviderEndpointRoutingPort,
} from "./provider-endpoint-routing.js";
export type {
  CreateDefaultProviderEndpointRoutingPortOptions,
  ResolveProcessProviderEndpointRoutingPortOptions,
} from "./provider-endpoint-routing.js";
export { startProcessProviderRegistryRuntime } from "./app/process-provider-registry-runtime.js";
export type { ProcessProviderRegistryRuntimeOptions } from "./app/process-provider-registry-runtime.js";
export {
  addRobinRunPluginMarketplace,
  getRobinRunPluginsOverview,
  installRobinRunMarketplacePlugin,
  listRobinRunPlugins,
  removeRobinRunPluginMarketplace,
  resolveRobinRunPlugins,
  setRobinRunPluginEnabled,
  uninstallRobinRunMarketplacePlugin,
  updateRobinRunMarketplacePlugin,
  updateRobinRunPluginMarketplace,
  validateRobinRunPluginPath,
} from "./plugins.js";
export type {
  AddRobinRunMarketplaceOptions,
  InstallRobinRunMarketplacePluginOptions,
  ListRobinRunPluginsOptions,
  RemoveRobinRunMarketplaceOptions,
  ResolveRobinRunPluginsOptions,
  SetRobinRunPluginEnabledOptions,
  SetRobinRunPluginEnabledResult,
  UninstallRobinRunMarketplacePluginOptions,
  UpdateRobinRunMarketplaceOptions,
  UpdateRobinRunMarketplacePluginOptions,
  ValidateRobinRunPluginPathOptions,
  RobinRunAvailablePluginData,
  RobinRunInstalledPluginData,
  RobinRunMarketplaceSummaryData,
  RobinRunMarketplaceUpdateData,
  RobinRunPluginInstallData,
  RobinRunPluginUpdateData,
  RobinRunPluginsOverviewData,
} from "./plugins.js";
export { runRobinRunProtocolAgent } from "./robinrun-protocol-entrypoint.js";
// Exposed for the CLI's --output-format stream-json: it needs the same event
// shape the protocol server emits, rather than inventing a second one.
export { mapSessionEvent } from "./robinrun-protocol/session-mapper.js";
export { prepareRobinRunTelemetryEnv, shutdownRobinRunTelemetry } from "./telemetry-bootstrap.js";
export type { SessionTranscriptMessage, SessionTranscriptPart } from "./session-transcript.js";
export { listRobinRunSessions, resolveLatestSession } from "./sessions.js";
export { inspectRobinRunSkill, listRobinRunSkills } from "./skills.js";
export type {
  InspectRobinRunSkillOptions,
  ListRobinRunSkillsOptions,
  RobinRunSkillInspection,
} from "./skills.js";
// Exposed for the CLI's headless slash routing: it must decide "is this a real
// custom command?" with the *same* reserved-name gate the app facade's
// customCommandPromptResolver applies, or the two disagree and a reserved name
// reaches the model as literal prompt text. See prompt-command.ts.
export { isReservedRobinRunSlashCommandName } from "./slash-command-surface.js";
export {
  grantWorkspaceHookTrust,
  inspectWorkspaceHookTrust,
  revokeWorkspaceHookTrustCli,
} from "./workspace-hook-trust-cli.js";
export type {
  WorkspaceHookTrustCliItem,
  WorkspaceHookTrustCliStatus,
  WorkspaceHookTrustCliTarget,
} from "./workspace-hook-trust-cli.js";

// 嵌入式调用复用产品请求装配，避免来源头与网络配置漂移。
export { createRuntimeAiSdkModelExecutionConfig } from "./model-config.js";
