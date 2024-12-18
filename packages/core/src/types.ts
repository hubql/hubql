export interface OpenAPISpec {
  openapi: string
  info: {
    title: string
    version: string
  }
  paths: Record<string, Record<string, OpenAPIOperation>>
}

export interface OpenAPIOperation {
  operationId: string
  summary: string
  description?: string
  parameters?: Array<{ name: string; in: string; required: boolean; description?: string }>
  responses: Record<string, any>
  requestBody?: any
}

export interface MdxOptions {
  operationId: string
  customContent?: string
}

export interface MergeOptions {
  baseMdx: string
  customMdx: string
}
