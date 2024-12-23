import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import { useMemo } from 'react'

export const useProcessedHtml = (content: string) => {
  return useMemo(() => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeStringify)

    return processor.processSync(content).toString()
  }, [content])
}
