import { cn } from '@hubql/ui/lib/utils'
import React from 'react'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { MDXProvider } from '@mdx-js/react'
import { Button } from './button'

export const DocsMarkdown = async ({
  frontmatter,
  content,
}: {
  frontmatter: any
  content: any
}) => {
  const { default: Content } = await evaluate(content, {
    ...runtime,
    Fragment: React.Fragment,
  })

  const defaultComponents = {
    Button: (props: any) => <Button {...props} />,
  }

  return (
    <div className={cn('col-span-12 md:col-span-8 px-4 lg:px-8')}>
      <div className="max-w-full w-full pb-24 prose prose-headings:text-white prose-p:text-neutral-400 prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-p:text-md prose-p:font-normal prose-li:text-md prose-li:text-neutral-800 dark:prose-li:text-neutral-300  prose-h3:text-2xl">
        <div className="w-full pt-8 lg:pt-0 pb-2 border-b border-neutral-800 mb-8">
          <div className=" w-full pt-8 lg:pt-0 pb-2 border-b border-neutral-800 mb-8">
            <h1 className="text-left text-3xl  mx-auto font-bold text-black dark:text-white">
              {frontmatter.title}
            </h1>
          </div>

          <div className="mt-4 w-full text-lg text-neutral-400">
            <MDXProvider components={defaultComponents}>
              <Content />
            </MDXProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
