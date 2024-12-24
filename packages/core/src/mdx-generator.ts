import { OpenAPIOperation } from './types'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'

export const generateMDX = async ({
  operation,
  content,
}: {
  operation: OpenAPIOperation
  content: string
}): Promise<string> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
  const processedContent = await processor.processSync(content).toString()
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
