import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'
import { ParamAttribute } from './param-attributes'
import { ParamOptional } from './param-optional'
import { Parameter } from '@hubql/store'

type ParamAccordionProps = {
  params: Parameter[]
}

export const ParamAccordion = ({ params = [] }: ParamAccordionProps) => {
  const groupedParams = params.reduce((acc: any, param: Parameter) => {
    if (!acc[param.in]) {
      acc[param.in] = { required: [], optional: [] }
    }
    if (param.required) {
      acc[param.in].required.push(param)
    } else {
      acc[param.in].optional.push(param)
    }
    return acc
  }, {})

  return (
    <Accordion
      type="multiple"
      className="w-full flex flex-col gap-8"
      defaultValue={groupedParams && Object.keys(groupedParams)}
    >
      {groupedParams && Object.keys(groupedParams).length > 0 ? (
        Object.entries(groupedParams).map(([key, group]: [string, any], index: number) => (
          <AccordionItem
            value={key}
            key={index}
            className="border border-border rounded-md overflow-clip"
          >
            <AccordionTrigger className="w-full bg-muted px-4 capitalize">
              {key} Parameters
            </AccordionTrigger>
            <AccordionContent className="w-full flex flex-col gap-2 py-2">
              {group.required.map((param: Parameter, idx: number) => (
                <ParamAttribute param={param} key={idx} />
              ))}
            </AccordionContent>
            {group.optional.length > 0 && <ParamOptional group={group} />}
          </AccordionItem>
        ))
      ) : (
        <p className="text-secondary-foreground">No parameters available for this method.</p>
      )}
    </Accordion>
  )
}
