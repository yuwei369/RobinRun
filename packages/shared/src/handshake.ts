export interface HelloMessage {
  type: "robinrun-hello";
  version: string;
  platform: string;
  arch: string;
  pid: number;
}

export interface HelloAckMessage {
  type: "robinrun-hello-ack";
  version: string;
  clientId: string;
}
