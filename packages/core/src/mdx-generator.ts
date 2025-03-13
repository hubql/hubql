import { OpenAPIOperation } from './types'

export const generateMDX = async ({
  operation,
  content,
}: {
  operation: OpenAPIOperation
  content: string
}): Promise<string> => {
  const { unified } = await import('unified')
  const remarkParse = (await import('remark-parse')).default
  const remarkRehype = (await import('remark-rehype')).default
  const rehypeSlug = (await import('rehype-slug')).default
  const rehypeStringify = (await import('rehype-stringify')).default

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
  const processedContent = await processor.processSync(content).toString()
  // ... rest of the function
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


${processedContent}
`
}
