import type { Event, IDisposable } from "@robinrun/rpc";
import type { RobinRunProtocolMessage } from "@robinrun/shared";

export type RobinRunProtocolTransportKind = "stdio" | "websocket" | "memory";

export interface RobinRunProtocolTransportClosedEvent {
  code?: number | null;
  signal?: NodeJS.Signals | null;
  reason?: string;
}

export interface RobinRunProtocolTransport extends IDisposable {
  readonly kind: RobinRunProtocolTransportKind;
  readonly onMessage: Event<RobinRunProtocolMessage>;
  readonly onClose: Event<RobinRunProtocolTransportClosedEvent>;
  send(message: RobinRunProtocolMessage): Promise<void>;
  disposeAndWait?(): Promise<void>;
}
