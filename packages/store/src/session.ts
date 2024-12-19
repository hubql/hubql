import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type SessionStore = {
  hubId: string | null
  workspaceId: string | null
  setHubId: (hubId: string | null) => void
  setWorkspaceId: (workspaceId: string | null) => void
  environmentId: string | null
  setEnvironmentId: (environmentId: string | null) => void
}
export const useHubqlSession = create(
  persist<SessionStore>(
    (set, _get) => ({
      hubId: null,
      workspaceId: null,
      setHubId: (hubId: string | null) => set({ hubId }),
      setWorkspaceId: (workspaceId: string | null) => set({ workspaceId }),
      environmentId: null,
      setEnvironmentId: (environmentId: string | null) => set({ environmentId }),
    }),
    {
      name: 'hubql_session', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
