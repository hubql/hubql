import { OpenAPIOperation } from './types'

export function generateMDX(operation: OpenAPIOperation): string {
  return `
# ${operation.summary}

${operation.description || ''}

## Parameters
${operation.parameters?.map((param) => `- **${param.name}** (${param.in})`).join('\n') || 'None'}

## Request Body
${operation.requestBody ? '```json\n' + JSON.stringify(operation.requestBody, null, 2) + '\n```' : 'No request body'}

## Responses
${Object.entries(operation.responses)
  .map(([status, res]) => `- **${status}**: ${res.description || ''}`)
  .join('\n')}
  `
}
