import { OpenApiSource, useHubqlStore } from '@hubql/store'
// import { NavLink } from 'react-router-dom'
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from './accordion'
import { Method } from './method'
// import { useHubqlSession } from '@hubql/store/session'

import React from 'react'

export const ReferenceMenu = ({ currentAPI }: { currentAPI: OpenApiSource | null }) => {
  const hubId = ''
  // Group paths by their tags
  function groupByTags(paths) {
    const grouped = {}
    for (const path in paths || {}) {
      for (const method in paths[path]) {
        const tags = paths[path][method].tags || []
        for (const tag of tags) {
          if (!grouped[tag]) {
            grouped[tag] = []
          }
          grouped[tag].push({
            path,
            methods: [
              {
                ...paths[path][method],
                method,
              },
            ],
          })
        }
      }
    }
    return grouped
  }

  const groupedPaths = groupByTags(currentAPI?.paths)

  return (
    <div className="max-md:hidden w-[340px] px-2 border-r border-border sticky h-[calc(100vh-56px)] overflow-y-auto scrollbar top-[56px] left-0 pb-16">
      {currentAPI && (
        <Accordion type="multiple" defaultValue={Object.keys(groupedPaths)}>
          {Object.keys(groupedPaths).map((tag) => (
            <AccordionItem key={tag} value={tag}>
              <AccordionTrigger className="w-full text-foreground text-left">
                <span className="capitalize"> {tag} </span>
              </AccordionTrigger>
              <AccordionContent className="w-full">
                {groupedPaths[tag].map((pathObj: any, index: any) => (
                  <div key={pathObj.path + index}>
                    {pathObj.methods.map((method: any) => (
                      <a
                        title={method?.summary}
                        href={`${hubId ? '/' + hubId : ''}/reference/${method?.operationId}`}
                        key={`${pathObj.path}-${method.method}`}
                        className="text-white flex flex-row gap-2 pl-1 pr-4 py-1 hover:bg-muted rounded-md items-start"
                      >
                        <Method variant={method.method} size={'xs'}>
                          {method.method.toUpperCase()}
                        </Method>
                        <p className="text-secondary-foreground aria-[current=page]:!text-blue-600 truncate">
                          {method.operationId}
                        </p>
                      </a>
                    ))}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
