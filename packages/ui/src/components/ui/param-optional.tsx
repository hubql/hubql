import { AccordionContent, AccordionTrigger } from './accordion'
import { ParamAttribute } from './param-attributes'
import { AccordionItem } from './accordion'

export const ParamOptional = ({ group }: { group: any }) => {
  return (
    <AccordionItem value="optional">
      <AccordionTrigger
        className="w-full px-4 capitalize flex justify-start text-secondary-foreground gap-2 text-sm items-center"
        chevron={false}
      >
        Optional
      </AccordionTrigger>
      <AccordionContent className="w-full flex flex-col gap-2 py-2">
        {group.optional.map((param: any, idx: number) => (
          <ParamAttribute param={param} key={idx} />
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}
