import { ReferenceMenu } from './reference-menu'
import { OpenAPISpec } from '@hubql/core'

export const ReferenceLayout = ({
  children,
  currentAPI,
}: {
  children: any
  currentAPI: OpenAPISpec | null
}) => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 w-full z-50 ">
        <div className="w-full bg-background min-h-14 border-b border-border flex items-center py-2 pl-4">
          API Reference
          <a href="/" className="ml-auto mr-4">
            Back to API Client
          </a>
        </div>
      </div>
      <div className="relative flex flex-row min-h-screen  mx-auto">
        <ReferenceMenu currentAPI={currentAPI} />
        <div className="relative grid grid-cols-1 md:grid-cols-2 max-md:gap-2 gap-8 w-full mt-[56px] max-w-desktop mx-auto px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  )
}
