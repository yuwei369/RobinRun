import {
  ProviderConfigService,
  type ProviderConfigLayerSnapshot,
  type ProviderConfigLayerUpdate,
} from "@robinrun/provider";
import { NodeRobinRunBuiltinProviderConfigSource } from "./robinrun-builtin-provider-config-source.js";
import {
  EndpointScopedRobinRunBuiltinSource,
  type EndpointScopedRobinRunBuiltinSourceOptions,
} from "./endpoint-scoped-robinrun-builtin-source.js";
import {
  RobinRunBuiltinRemoteSynchronizer,
  type RobinRunBuiltinRemoteSynchronizerOptions,
  type RobinRunBuiltinRefreshResult,
} from "./robinrun-builtin-remote-synchronizer.js";
import {
  NodePersonalProviderConfigRepository,
  type PersonalProviderConfigRecoveryEvent,
} from "./personal-provider-config-repository.js";

export interface NodeProviderConfigRuntimeOptions {
  readonly robinrunBuiltinFilePath: string;
  readonly robinrunBuiltinActiveFilePath?: string;
  readonly robinrunBuiltinRemote?: Omit<RobinRunBuiltinRemoteSynchronizerOptions, "source">;
  readonly robinrunBuiltinEnvironment?: Omit<
    EndpointScopedRobinRunBuiltinSourceOptions,
    "bundledFilePath"
  >;
  readonly onRobinRunBuiltinRefreshError?: (error: unknown) => void;
  readonly onPersonalConfigRecovery?: (event: PersonalProviderConfigRecoveryEvent) => void;
  readonly onPersonalConfigPollingError?: (error: unknown) => void;
  readonly personalFilePath: string;
  readonly personalPollingIntervalMs?: number | false;
  readonly importLegacy?: (
    robinrunBuiltin: ProviderConfigLayerSnapshot,
  ) => Promise<ProviderConfigLayerUpdate | null>;
  readonly watch?: boolean;
}

/** 组装一个 Node.js 进程内共享的 RobinRun Built-in/Personal Config 运行边界。 */
export class NodeProviderConfigRuntime {
  readonly configService: ProviderConfigService;
  readonly #robinrunBuiltinSource:
    | NodeRobinRunBuiltinProviderConfigSource
    | EndpointScopedRobinRunBuiltinSource;
  readonly #personalRepository: NodePersonalProviderConfigRepository;
  readonly #remoteSynchronizer?: RobinRunBuiltinRemoteSynchronizer;
  readonly #onRemoteRefreshError?: (error: unknown) => void;
  #startPromise: Promise<void> | null = null;
  #disposed = false;
  readonly #checkListeners = new Set<() => Promise<void>>();
  #checkTimer: ReturnType<typeof setInterval> | null = null;
  #checkInFlight: Promise<void> | null = null;

  constructor(options: NodeProviderConfigRuntimeOptions) {
    this.#robinrunBuiltinSource = options.robinrunBuiltinEnvironment
      ? new EndpointScopedRobinRunBuiltinSource({
          bundledFilePath: options.robinrunBuiltinFilePath,
          ...options.robinrunBuiltinEnvironment,
        })
      : new NodeRobinRunBuiltinProviderConfigSource({
          bundledFilePath: options.robinrunBuiltinFilePath,
          activeFilePath: options.robinrunBuiltinActiveFilePath,
          watch: options.watch,
        });
    this.#remoteSynchronizer =
      options.robinrunBuiltinRemote &&
      this.#robinrunBuiltinSource instanceof NodeRobinRunBuiltinProviderConfigSource
        ? new RobinRunBuiltinRemoteSynchronizer({
            source: this.#robinrunBuiltinSource,
            ...options.robinrunBuiltinRemote,
          })
        : undefined;
    this.#onRemoteRefreshError = options.onRobinRunBuiltinRefreshError;
    this.#personalRepository = new NodePersonalProviderConfigRepository({
      filePath: options.personalFilePath,
      onRecovery: options.onPersonalConfigRecovery,
      onPollingError: options.onPersonalConfigPollingError,
      pollingIntervalMs: options.personalPollingIntervalMs,
      ...(options.importLegacy
        ? {
            importLegacy: async () => options.importLegacy!(await this.#robinrunBuiltinSource.read()),
          }
        : {}),
    });
    this.configService = new ProviderConfigService({
      robinrunBuiltinSource: this.#robinrunBuiltinSource,
      personalRepository: this.#personalRepository,
    });
  }

  resolveRobinRunBuiltinActiveFilePath(): Promise<string> {
    return this.#robinrunBuiltinSource instanceof NodeRobinRunBuiltinProviderConfigSource
      ? Promise.resolve(this.#robinrunBuiltinSource.activeFilePath)
      : this.#robinrunBuiltinSource.resolveActiveFilePath();
  }

  get personalRepository(): import("@robinrun/provider").PersonalProviderConfigRepository {
    return this.#personalRepository;
  }

  /** Environment 同一周期检查中恢复未对齐依赖，不被下载 TTL 或失败挡住。 */
  onDidCheckRobinRunBuiltin(listener: () => Promise<void>): () => void {
    this.#checkListeners.add(listener);
    return () => this.#checkListeners.delete(listener);
  }

  start(): Promise<void> {
    if (this.#disposed) throw new Error("NodeProviderConfigRuntime 已 dispose");
    if (this.#startPromise) return this.#startPromise;
    const startPromise = this.configService.read().then(() => {
      if (this.#disposed) return;
      void this.#checkBackground();
      // Managed Worker 无下载配置也无恢复 owner，不建立周期任务。
      if (
        this.#remoteSynchronizer ||
        this.#robinrunBuiltinSource instanceof EndpointScopedRobinRunBuiltinSource ||
        this.#checkListeners.size > 0
      ) {
        this.#checkTimer = setInterval(() => {
          void this.#checkBackground();
        }, 60_000);
        this.#checkTimer.unref?.();
      }
    });
    this.#startPromise = startPromise;
    void startPromise.catch(() => {
      if (this.#startPromise === startPromise) this.#startPromise = null;
    });
    return startPromise;
  }

  refreshRobinRunBuiltin(options?: { readonly force?: boolean }): Promise<RobinRunBuiltinRefreshResult> {
    if (this.#disposed) return Promise.resolve("disposed");
    if (this.#robinrunBuiltinSource instanceof EndpointScopedRobinRunBuiltinSource) {
      return this.#robinrunBuiltinSource.refresh(options);
    }
    return this.#remoteSynchronizer?.refresh(options) ?? Promise.resolve("skipped");
  }

  #checkBackground(): Promise<void> {
    if (this.#disposed) return Promise.resolve();
    if (this.#checkInFlight) return this.#checkInFlight;
    const check = Promise.allSettled([
      this.refreshRobinRunBuiltin(),
      ...[...this.#checkListeners].map((listener) => Promise.resolve().then(listener)),
    ])
      .then((results) => {
        if (this.#disposed) return;
        for (const result of results)
          if (result.status === "rejected") this.#onRemoteRefreshError?.(result.reason);
      })
      .finally(() => {
        if (this.#checkInFlight === check) this.#checkInFlight = null;
      });
    this.#checkInFlight = check;
    return check;
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    if (this.#checkTimer) clearInterval(this.#checkTimer);
    this.#checkTimer = null;
    this.#checkListeners.clear();
    this.#remoteSynchronizer?.dispose();
    this.configService.dispose();
    this.#personalRepository.dispose();
    this.#robinrunBuiltinSource.dispose();
  }
}

export function createNodeProviderConfigRuntime(
  options: NodeProviderConfigRuntimeOptions,
): NodeProviderConfigRuntime {
  return new NodeProviderConfigRuntime(options);
}
