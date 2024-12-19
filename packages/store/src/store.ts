import { del, get, set } from 'idb-keyval'
import { create } from 'zustand'
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware'
import { useHubqlSession } from './session'
import { OpenAPIV3_1 } from 'openapi-types'

export type Flow = {
  id: string
  name: string
  environmentId: string
}

export type Trigger = {
  id: string
  name: string
  flowId: string
  type: 'HTTP_STATUS_CODE' | 'SCHEDULE'
  httpStatusCode?: number[]
  cron?: string
}
export type ActionHttpRequest = {
  id: string
  operationId: string
}
export type ActionSetEnvironmentVariable = {
  id: string
  jq: string
  environmentVariableId: string
}
export type Action = {
  flowId: string
  sourceIds: string[]
  id: string
  name: string
  type: 'HTTP_REQUEST' | 'SET_ENVIRONMENT_VARIABLE'
}

export type OpenApiSource = OpenAPIV3_1.Document
export type OpenApiSource_OLD = {
  components: {
    schemas: {
      [key: string]: {
        type: string
        properties: {
          [key: string]: {
            type: string
            example: string
          }
        }
      }
    }
  }
  openapi: string
  info: {
    title: string
    version: string
  }
  servers: {
    url: string
    description: string
  }[]
  tags: {
    name: string
    description: string
  }[]
  paths: {
    [path: string]: {
      [method: string]: {
        summary: string
        description: string
        tags: string[]
        operationId: string
        requestBody: {
          content: {
            [contentType: string]: {
              schema: {
                $ref: string
              }
            }
          }
        }
        parameters: {
          name: string
          in: string
          description: string
          required: boolean
          schema: {
            type: string
          }
        }[]
        responses: {
          [status: string]: {
            description: string
            content: {
              [contentType: string]: {
                schema: {
                  type: string
                  properties: {
                    [key: string]: {
                      type: string
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export type Environment = {
  id: string
  name: string
  baseUrl: string
}
export type EnvironmentVariable = {
  id: string
  key: string
  description: string
}

export type MethodType =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head'
  | 'trace'
  | 'connect'
export type Method = {
  id: string
  type: MethodType
}
type Path = {
  id: string
  name: string
  methods: Method
}

type Operation = {
  id: string
  path: string
  method: MethodType
  isCustom: boolean
}

export type RequestParameterType = 'path' | 'query'

export type RequestParameter = {
  id: string
  operationId: string
  key: string
  value: string
  type: RequestParameterType
  description: string
}

export type RequestBody = {
  id: string
  type: 'application/json' | 'application/x-www-form-urlencoded' | 'text/plain'
  operationId: string | null
  value: string
}

export type RequestAuthentication = {
  id: string
  operationId: string | null
  type: 'BEARER' //| 'BASIC' | 'API_KEY'
  value: string
  environmentId: string | null
  // specific for BEARER process we should have also oauth specs from API spec by default
}

export type RequestHeader = {
  id: string
  operationId: string | null
  key: string
  value: string
  description: string
}

type RequestHistory = {
  id: string
  requestId: string
  request: Request
  response: Response
}

export type Comment = {
  id: string
  workspaceId: string
  hubId: string
  operationId: string
  text: string
  createdAt: Date
}

type Store = {
  featureFlags: string[]
  setFeatureFlags: (featureFlags: string[]) => void
  requestAuthentications: RequestAuthentication[]
  setRequestAuthentications: (authentications: RequestAuthentication[]) => void
  requestHistory: RequestHistory[]
  setRequestHistory: (history: RequestHistory[]) => void
  requestHeaders: RequestHeader[]
  setRequestHeaders: (headers: RequestHeader[]) => void
  requestBodies: RequestBody[]
  setRequestBodies: (bodies: RequestBody[]) => void
  environments: Environment[]
  setEnvironments: (environments: Environment[]) => void
  environmentVariables: EnvironmentVariable[]
  setEnvironmentVariables: (variables: EnvironmentVariable[]) => void
  flows: Flow[]
  setFlows: (flows: Flow[]) => void
  triggers: Trigger[]
  setTriggers: (triggers: Trigger[]) => void
  comments: Comment[]
  addComment: (comment: Comment) => void
  setComments: (comments: Comment[]) => void
  showComment: boolean
  showOperations: boolean
  showSettings: boolean
  setShowSettings: (showSettings: boolean) => void
  setShowComment: (showComment: boolean) => void
  setShowOperations: (showOperations: boolean) => void
  operations: Operation[]
  setOperations: (operations: Operation[]) => void
  currentOperationId: string | null
  setCurrentOperationId: (id: string) => void
  currentAPI: OpenApiSource | null
  setAPI: (api: OpenApiSource) => void
  requestParameters: RequestParameter[]
  setRequestParameters: (parameters: RequestParameter[]) => void
  response: Response | null
  setResponse: (response: Response | null) => void
  data: any
  setData: (data: any) => void
  currentMethod: Method | null
  currentPath: Path | null
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  pollingInterval: number
  setPollingInterval: (interval: number) => void
  isRequestOngoing: boolean
  setIsRequestOngoing: (isRequestOngoing: boolean) => void
  showImport: boolean
  setShowImport: (showImport: boolean) => void
}

const customStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.debug(name, 'has been retrieved')
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.debug(name, 'with value', value, 'has been saved')
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    console.debug(name, 'has been deleted')
    await del(name)
  },
}

let dataStore: any = null
export const useHubqlStore = <T>(selector: (state: Store) => T): T => {
  const hubId = useHubqlSession((state) => state.hubId) ?? 'temp'

  if (!dataStore || dataStore.hubId !== hubId) {
    dataStore = createHubqlStore(hubId)
    dataStore.hubId = hubId // Store the hubId to check later
  }
  return dataStore(selector)
}

export const createHubqlStore = (hubId: string) =>
  create(
    persist<Store>(
      (set) => ({
        featureFlags: [],
        setFeatureFlags: (featureFlags: string[]) => {
          return set((state) => ({
            ...state,
            featureFlags,
          }))
        },
        triggers: [],
        setTriggers: (triggers) => {
          return set((state) => ({
            ...state,
            triggers,
          }))
        },
        flows: [],
        setFlows: (flows) => {
          return set((state) => ({
            ...state,
            flows,
          }))
        },
        pollingInterval: 0,
        setPollingInterval: (interval) => {
          return set((state) => ({
            ...state,
            pollingInterval: interval,
          }))
        },
        environmentVariables: [],
        setEnvironmentVariables: (variables: EnvironmentVariable[]) => {
          return set((state) => ({
            ...state,
            environmentVariables: variables,
          }))
        },
        requestAuthentications: [],
        setRequestAuthentications: (authentications: RequestAuthentication[]) => {
          return set((state) => ({
            ...state,
            requestAuthentications: authentications,
          }))
        },

        operations: [],
        setOperations: (pairs: Operation[]) => {
          return set((state) => ({ ...state, operations: pairs }))
        },
        requestParameters: [],
        setRequestParameters: (parameters: RequestParameter[]) => {
          return set((state) => ({
            ...state,
            requestParameters: parameters,
          }))
        },
        requestHeaders: [],
        setRequestHeaders: (headers: RequestHeader[]) => {
          return set((state) => ({
            ...state,
            requestHeaders: headers,
          }))
        },
        requestBodies: [],
        setRequestBodies(bodies) {
          return set((state) => ({ ...state, requestBodies: bodies }))
        },
        requestHistory: [],
        setRequestHistory(history) {
          return set((state) => ({
            ...state,
            requestHistory: history,
          }))
        },
        environments: [],
        setEnvironments: (environments) => {
          return set((state) => ({ ...state, environments }))
        },
        comments: [],
        response: null,
        currentMethod: null,
        currentPath: null,
        currentOperationId: null,
        setCurrentOperationId(id) {
          return set((state) => ({
            ...state,
            currentOperationId: id,
          }))
        },
        setResponse: (response: Response) => {
          return set((state) => ({ ...state, response }))
        },
        data: null,
        setData: (data: any) => {
          return set((state) => ({ ...state, data }))
        },
        addComment: (comment: Comment) =>
          set((state) => ({
            comments: [...state.comments, comment],
          })),
        setComments: (comments: Comment[]) => {
          return set((state) => ({
            ...state,
            comments,
          }))
        },
        currentAPI: null,
        showComment: false,
        setShowComment(showComment: boolean) {
          return set((state) => ({ ...state, showComment }))
        },
        showOperations: true,
        setShowOperations(showOperations: boolean) {
          return set((state) => ({
            ...state,
            showOperations,
          }))
        },
        showSettings: false,
        setShowSettings(showSettings: boolean) {
          return set((state) => ({ ...state, showSettings }))
        },
        setAPI: (api: OpenApiSource | null) => {
          return set((state) => ({
            ...state,
            currentAPI: api,
          }))
        },
        _hasHydrated: false,
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state,
          })
        },
        isRequestOngoing: false,
        setIsRequestOngoing: (isRequestOngoing) => {
          return set((state) => ({
            ...state,
            isRequestOngoing,
          }))
        },
        showImport: false,
        setShowImport: (showImport) => {
          return set((state) => ({
            ...state,
            showImport,
          }))
        },
      }),
      {
        name: `hubql_client_${hubId}`,
        storage: createJSONStorage(() => customStorage),
        onRehydrateStorage: () => (state) => {
          state && state.setHasHydrated(true)
        },
      }
    )
  )
