import { describe, expect, it } from "vitest";
import { resolveDefaultEmbeddedSearchBackend } from "../src/app/embedded-search-backend.js";

describe("resolveDefaultEmbeddedSearchBackend", () => {
  it("uses bundled bfs, ugrep, and ripgrep paths by default", () => {
    expect(
      resolveDefaultEmbeddedSearchBackend({
        env: {
          ROBINRUN_BFS_BINARY: "/opt/robinrun/tools/bfs/bfs",
          ROBINRUN_RG_BINARY: "/opt/robinrun/tools/ripgrep/rg",
          ROBINRUN_UGREP_BINARY: "/opt/robinrun/tools/ugrep/ugrep",
        },
      }),
    ).toEqual({
      kind: "native-binaries",
      findCommand: "/opt/robinrun/tools/bfs/bfs",
      grepCommand: "/opt/robinrun/tools/ugrep/ugrep",
      rgCommand: "/opt/robinrun/tools/ripgrep/rg",
    });
  });

  it("falls back to bfs, ugrep, and rg command names when bundled paths are unavailable", () => {
    expect(resolveDefaultEmbeddedSearchBackend({ env: {} })).toEqual({
      kind: "native-binaries",
      findCommand: "bfs",
      grepCommand: "ugrep",
      rgCommand: "rg",
    });
  });

  it("preserves the explicit internal CLI compatibility override", () => {
    expect(
      resolveDefaultEmbeddedSearchBackend({
        env: { ROBINRUN_EMBEDDED_SEARCH_COMMAND: "/tmp/robinrun-test" },
      }),
    ).toEqual({
      kind: "internal-cli",
      command: "/tmp/robinrun-test",
      args: ["__internal-search"],
    });
  });
});
