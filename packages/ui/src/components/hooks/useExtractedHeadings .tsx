import { useMemo } from 'react'
import rehypeParse from 'rehype-parse'
import { unified } from 'unified'

export const useExtractedHeadings = (html: string) => {
  return useMemo(() => {
    const tree = unified().use(rehypeParse, { fragment: true }).parse(html)
    const headings: { text: string; id: string }[] = []

    const extractHeadings = (node: any) => {
      if (node.tagName && /^h[1-6]$/.test(node.tagName) && node.properties?.id) {
        const textContent = node.children
          .filter((child: any) => child.type === 'text')
          .map((child: any) => child.value)
          .join(' ')
        headings.push({ text: textContent, id: node.properties.id })
      }
      node.children?.forEach(extractHeadings)
    }

    extractHeadings(tree)
    return headings
  }, [html])
}
