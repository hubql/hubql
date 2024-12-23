import React from 'react'

export const DocsOutline = ({ headings }: { headings: any }) => {
  return (
    headings.length > 0 && (
      <div className="hidden col-span-4 top-0 right-0 z-10 border-l border-neutral-800 md:flex flex-col p-8 gap-2">
        {headings.map((heading: any, index: number) => (
          <a
            key={index}
            className="text-base text-neutral-400 hover:text-white hover:underline hover:underline-offset-4"
            href={`#${heading.id}`}
          >
            {heading.text}
          </a>
        ))}
      </div>
    )
  )
}
