import { useRobinRunStoreWithDefault } from "@/store/StoreProvider.js";

export function useIsOfficeMode(): boolean {
  return useRobinRunStoreWithDefault((state) => state.interfaceMode === "office", false);
}
