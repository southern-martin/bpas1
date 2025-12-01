import { create } from "zustand";

export const useSyncStatus = create(set => ({
  status: "ok", // ok | syncing | error
  lastSync: null,
  setStatus: status => set({ status }),
  setLastSync: ts => set({ lastSync: ts })
}));
