import { describe, expect, it } from "vitest";
import { resourcePath } from "./routes.ts";

const SITE = "1978123456789012480";
const DEP = "1978123456789012481";

describe("resourcePath", () => {
  it.each([
    ["robinrun-site://usage", "/api/v1/sites/usage"],
    ["robinrun-site://plans", "/api/v1/sites/plans"],
    ["robinrun-site://sites", "/api/v1/sites"],
    ["robinrun-site://sites?cursor=", "/api/v1/sites"],
    ["robinrun-site://sites?cursor=a%2Fb&limit=20", "/api/v1/sites?cursor=a%2Fb&limit=20"],
    [`robinrun-site://sites/${SITE}`, `/api/v1/sites/${SITE}`],
    [
      `robinrun-site://sites/${SITE}/deployments?cursor=x`,
      `/api/v1/sites/${SITE}/deployments?cursor=x`,
    ],
    [`robinrun-site://sites/${SITE}/deployments/${DEP}`, `/api/v1/sites/${SITE}/deployments/${DEP}`],
    [`robinrun-site://sites/${SITE}/cover`, `/api/v1/sites/${SITE}/cover`],
    [
      `robinrun-site://sites/${SITE}/deployments/${DEP}/logs?offset=12`,
      `/api/v1/sites/${SITE}/deployments/${DEP}/logs?offset=12`,
    ],
  ])("maps %s", (uri, path) => {
    expect(resourcePath(uri)).toBe(path);
  });

  it.each([
    "robinrun-site://other",
    "https://sites/1",
    "robinrun-site://usage?cursor=1",
    "robinrun-site://plans?limit=1",
    "robinrun-site://plans/free",
    "robinrun-site://sites/abc",
    "robinrun-site://sites/0123",
    "robinrun-site://sites/1/deployments/2/logs/extra",
    "robinrun-site://sites/1/cover/2",
    "robinrun-site://sites/1/cover?offset=1",
    "robinrun-site://sites/1/settings",
    "robinrun-site://sites/1/deployments/2/logs?offset=-1",
    "robinrun-site://sites?limit=1e3",
    "robinrun-site://sites?cursor=a&cursor=b",
    "robinrun-site://sites/1/deployments/2?offset=1",
    "robinrun-site://user@sites",
    "robinrun-site://sites/..%2Fusage",
    "not a uri",
  ])("rejects %s", (uri) => {
    expect(resourcePath(uri)).toBeUndefined();
  });
});
