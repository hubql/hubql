import * as fs from 'fs-extra'
//@ts-expect-error
import { parse } from 'yaml'
import { OpenAPISpec } from './types'

export async function parseOpenApiSpec(filePath: string): Promise<OpenAPISpec> {
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const isYaml = filePath.endsWith('.yaml') || filePath.endsWith('.yml')
  const openApiSpec = isYaml ? parse(fileContent) : JSON.parse(fileContent)
  return openApiSpec as OpenAPISpec
}
