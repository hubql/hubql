import { OpenAPISpec } from '@hubql/core';
import { Code } from './code'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'


export const ResponseExample = ({ methodInfo, currentAPI }: { response: any, methodInfo: any, currentAPI: OpenAPISpec }) => {
  const resolveProperty = (property: any): any => {
    if (property.example) return property.example
    if (property.default) return property.default
    if (property.description) return property.description
    if (property.type === 'object' && property.properties) {
      const resolvedObject = Object.keys(property.properties).reduce((acc: any, key: string) => {
        acc[key] = resolveProperty(property.properties[key])
        return acc
      }, {})
      return resolvedObject
    }
    if (property.type === 'array' && property.items) {
      return [resolveProperty(property.items)]
    }
    return ''
  }

  const getResponseExample = (response: any) => {
    const schemaRef = response?.content?.['application/json']?.schema?.$ref
    if (schemaRef) {
      const schemaName = schemaRef.split('/').pop()
      const schema = currentAPI?.components?.schemas?.[schemaName]
      if (schema && schema.properties) {
        const example = Object.keys(schema.properties).reduce((acc: any, prop: string) => {
          const property = schema.properties[prop]
          if (property) {
            acc[prop] = resolveProperty(property)
          }
          return acc
        }, {})

        // Explicitly handle category (assuming it's an object) and tags (assuming it's an array)
        if (schema.properties.category) {
          example.category = resolveProperty(schema.properties.category)
        }

        if (schema.properties.tags) {
          example.tags = resolveProperty(schema.properties.tags)
        }

        return example
      }
    }

    const exampleObject = response?.content?.['application/json']?.examples
    if (exampleObject) {
      const keys = Object.keys(exampleObject)
      if (keys.length > 0) {
        return exampleObject[keys[0]].value
      }
    }

    return (
      response.content?.['application/json']?.example ||
      response.content?.['application/xml']?.example ||
      response.content?.['text/plain']?.example ||
      'No example available'
    )
  }

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <p className="py-2">Response Example</p>
      <Tabs defaultValue={Object.keys(methodInfo.responses)[0]} className="w-full">
        <TabsList className="mb-2">
          {Object.keys(methodInfo.responses).map((status) => (
            <TabsTrigger key={status} value={status}>
              {status}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(methodInfo.responses).map(([status, response]) => (
          <TabsContent key={status} value={status}>
            <div className="w-full overflow-clip rounded-lg">
              <Code
                code={JSON.stringify(getResponseExample(response), null, 2)}
                language={'json'}
                showInfoBar={true}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
