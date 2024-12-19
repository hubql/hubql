import React from 'react'
import { Parameter, ParameterType } from '@hubql/store'

const getType = (schema: any): string => {
  if (schema.type) return schema.type
  if (schema.anyOf) return schema.anyOf.map((s: any) => getType(s)).join(' or ')
  if (schema.oneOf) return schema.oneOf.map((s: any) => getType(s)).join(' or ')
  if (schema.allOf) return schema.allOf.map((s: any) => getType(s)).join(' and ')
  return 'unknown'
}

export const ParamAttribute = ({ param }: { param: Parameter }) => {
  const renderDetailedType = (type: ParameterType) => {
    if (type?.type === 'object') {
      return (
        <div className="ml-4">
          <p className="text-secondary-foreground">Properties:</p>
          {Object.entries(type.properties || {}).map(([key, value]: [string, ParameterType]) => (
            <div key={key} className="ml-4">
              <p>
                {key}: {value.type || getType(value)}
              </p>
            </div>
          ))}
        </div>
      )
    }
    if (type?.type === 'array') {
      return (
        <div className="ml-4">
          <p className="text-secondary-foreground">Items:</p>
          {renderDetailedType(type.items as ParameterType)}
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-2 ">
      <div className="flex flex-row gap-2">
        <p>{param.name}</p>
        <p className="text-secondary-foreground px-1 py-px rounded-sm bg-secondary-foreground-muted">
          {param.schema?.type || getType(param.schema)}
        </p>
        <p className="text-accent">{param.required ? 'required' : null}</p>
      </div>
      <p className="text-secondary-foreground">{param.description}</p>
      {param.schema && renderDetailedType(param.schema)}
    </div>
  )
}
