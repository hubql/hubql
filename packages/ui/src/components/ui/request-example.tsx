import { fetchToCurl } from '@hubql/core'
import { Code } from './code'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { useEffect, useState } from 'react'

export const RequestExample = ({
  method,
  url,
  body,
  headers,
}: {
  method: string
  url: string | null
  body: string | null
  headers: any
}) => {
  const [curlCommand, setCurlCommand] = useState<string | null>(null)
  useEffect(() => {
    const buildCurl = async () => {
      if (!url) return
      const curl = await fetchToCurl(url, {
        method: method,
        body,
        headers,
      })
      if (!curl) return
      setCurlCommand(curl)
    }
    buildCurl()
  }, [url, method])

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <p className="py-2">Request Example</p>
      <Tabs defaultValue={'curl'} className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value={'curl'}>curl</TabsTrigger>
        </TabsList>
        <TabsContent value={'curl'}>
          <div className="w-full overflow-clip rounded-lg">
            <Code code={curlCommand} language={'bash'} showInfoBar={true} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
