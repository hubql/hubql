import { cn } from '@hubql/ui/lib/utils'
import React, { FC } from 'react'
import { DocsOutline } from './docs-outline'
import { DocsMarkdown } from './docs-markdown'

import { useExtractedHeadings } from '../hooks/useExtractedHeadings '

interface DocsDocumentProps {
  content: {
    frontmatter: any
    content: string
  }
}

export const DocsDocument: FC<DocsDocumentProps> = ({ content: { frontmatter, content } }) => {
  const headings = useExtractedHeadings(content)

  const getMaxWidthClass = (headingsLength: number, outline: boolean) => {
    return headingsLength === 0 || !outline ? '!max-w-5xl' : ''
  }

  const getColumnSpanClass = (headingsLength: number, outline: boolean) => {
    return headingsLength === 0 || !outline ? 'md:!col-span-12' : ''
  }

  return (
    <div className="relative w-full px-0 py-16 pb-16 mx-auto lg:pl-[320px]">
      <div
        className={cn(
          'max-w-7xl mx-auto grid grid-cols-12 min-h-screen',
          getMaxWidthClass(headings.length, frontmatter.outline)
        )}
      >
        <div
          className={cn(
            'col-span-12 md:col-span-8 px-4 lg:px-8',
            getColumnSpanClass(headings.length, frontmatter.outline)
          )}
        >
          <DocsMarkdown frontmatter={frontmatter} content={content} />
        </div>
        {frontmatter.outline && <DocsOutline headings={headings} />}
      </div>
    </div>
  )
}
