import { describe, it, expect } from 'vitest'
import { parseOpenApiSpec } from '../src/openapi-parser'

describe('parseOpenApiSpec', () => {
  it('parses a simple OpenAPI YAML file', async () => {
    const spec = await parseOpenApiSpec('./examples/openapi.yaml')
    expect(spec.info.title).toBe('Example API')
    expect(spec.paths['/users'].get.operationId).toBe('getUsers')
  })
})
