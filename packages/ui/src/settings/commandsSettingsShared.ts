import {
  ROBINRUN_AGENT_PROVIDER,
  ROBINRUN_COMMAND_AGENT_SOURCES,
  type RobinRunProvider,
  type CommandAgentSource,
} from "@robinrun/shared";

export const COMMAND_AGENT_SOURCES = [
  ...ROBINRUN_COMMAND_AGENT_SOURCES,
] as const satisfies readonly CommandAgentSource[];

export const COMMAND_AGENT_SOURCE_META: Record<
  CommandAgentSource,
  {
    labelId: string;
    provider: RobinRunProvider;
    pathHint: string;
  }
> = {
  robinrunAgent: {
    labelId: "settings.commands.source.robinrunAgent",
    pathHint: "~/.robinrun/commands",
    provider: ROBINRUN_AGENT_PROVIDER,
  },
};
