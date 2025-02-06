import { OpenAPIV3_1 } from 'openapi-types'

export type Parameter = {
  name: string
  in: string
  description: string
  required: boolean
  schema: any
}
export type ParameterType = {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null' | 'any' | 'unknown'
  properties?: Record<string, ParameterType>
  items?: ParameterType
}


export interface OpenAPISpec {
  openapi: string
  info: {
    title: string
    version: string
  }
  paths: Record<string, Record<string, OpenAPIOperation>>
  components?: {
    schemas: Record<string, any>
  }
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
export type EnvironmentVariable = {
  id: string
  key: string
  description: string
}
export type EnvironmentVariableValue = {
  id: string
  environmentId: string | null
  environmentVariableId: string
  value: string
}

export interface OpenAPIOperation {
  operationId: string
  summary: string
  description?: string
  parameters?: Array<{ name: string; in: string; required: boolean; description?: string }>
  responses: Record<string, any>
  requestBody?: any
  tags?: string[]
}

export interface MdxOptions {
  operationId: string
  customContent?: string
}

export interface MergeOptions {
  baseMdx: string
  customMdx: string
}
