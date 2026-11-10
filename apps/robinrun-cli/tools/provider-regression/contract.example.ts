import type { ProviderRegressionContract } from "#contract";
export function exampleProviderRegression(contract: ProviderRegressionContract) {
  return contract.run({
    providersFile: "/Users/dev/.config/robinrun/provider-regression/providers.json",
    listFile: "test-list.json",
    dryRun: true,
  });
}
