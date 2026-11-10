import {
  DEFAULT_FEEDBACK_TICKET_FRAMEWORK,
  type RobinRunProvider,
  type FeedbackTicketFramework,
} from "@robinrun/shared";

export function inferFeedbackFrameworkFromAgentProvider(
  _provider: RobinRunProvider | null | undefined,
): FeedbackTicketFramework {
  return DEFAULT_FEEDBACK_TICKET_FRAMEWORK;
}
