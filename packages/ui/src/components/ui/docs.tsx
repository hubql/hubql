import { DocsMenu } from './docs-menu'
import { DocsDocument } from './docs-document'

export const Docs = ({
  menu,
  content,
}: {
  menu: any[]
  content: {
    frontmatter: any
    content: string
  }
}) => {
  return (
    <div>
      <div className="progress"></div>
      <div className="relative w-full h-fit flex flex-row px-8 overflow-visible">
        <DocsMenu menu={menu} />
        {content && <DocsDocument content={content} />}
      </div>
    </div>
  )
}
