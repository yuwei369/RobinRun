export const CLI_COMMAND_NAME = "robinrun";
export const CLI_PROCESS_NAME = "robinrun-cli";

interface ProcessTitleTarget {
  title: string;
}

export const setCliProcessTitle = (
  target: ProcessTitleTarget = process,
): void => {
  target.title = CLI_PROCESS_NAME;
};
