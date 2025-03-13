import { BookOpen, ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'

export const DocsMenu = ({ menu = [] }: { menu: any[] }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <div>
      <div className="fixed text-white h-full max-h-full w-[320px] left-0 bg-black z-10 border-r border-zinc-800 py-8 hidden lg:block mb-px overflow-y-auto scrollbar">
        <div className="h-max flex flex-col gap-8 px-4">
          <div className="border-b border-neutral-800 pb-8">
            <p className="inline-flex items-center gap-2 text-base mb-0">
              <BookOpen className="h-5 stroke-accent-100" />
              Hubql Docs
            </p>

            <div className="relative mt-4">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 stroke-neutral-400" />
              <input
                type="search"
                className="w-full h-10 pl-9 pr-4 py-2 text-sm text-neutral-400 bg-neutral-900 rounded-lg border border-neutral-700 focus:border-accent-100 focus:outline-none"
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
                placeholder="Search docs"
              />
            </div>
          </div>
          {menu.map((menuItem: any, index: number) => {
            if (
              !search ||
              menuItem.items.find((item: any) => item.title.toLowerCase().includes(search))
            ) {
              return (
                <div
                  key={'menuItem-' + index}
                  className="border-b border-neutral-800 last:border-none pb-8"
                >
                  {!search && <h3 className="text-base font-bold mb-1">{menuItem.category}</h3>}
                  <div className="flex flex-col gap-2">
                    {menuItem.items.map((item: any, index: number) => {
                      return (
                        <a
                          key={'item-' + index}
                          href={`/docs/${menuItem.categoryUrl}/${item.filename}`}
                          className="text-neutral-400 text-base"
                        >
                          {item.title}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )
            }
            {
              return null
            }
          })}
        </div>
      </div>
      <div
        className="fixed top-[55px] py-2 px-4 bg-black w-full border-y border-neutral-800 left-0 z-10 h-12 items-center justify-between font-semibold flex lg:hidden"
        onClick={() => setOpen(true)}
      >
        Docs
        <ChevronDown className="w-5 h-5" />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full h-full" side={'top'}>
          <SheetHeader>
            <SheetTitle className="text-neutral-400">What do you want to know?</SheetTitle>
            <div className="h-[calc(100vh-80px)] overflow-y-auto">
              <div className="h-max flex flex-col">
                <Accordion type="single" collapsible>
                  {menu.map((menuItem: any, index: number) => {
                    return (
                      <AccordionItem
                        key={'menuItem-' + index}
                        value={'menuItem-' + index}
                        className="px-4 border-none"
                      >
                        <AccordionTrigger className="py-2 flex items-end">
                          <h3 className="text-base font-bold mb-0">{menuItem.category}</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2">
                            {menuItem.items.map((item: any, index: number) => {
                              return (
                                <a
                                  key={'item-' + index}
                                  onClick={() => setOpen(false)}
                                  href={`/docs/${menuItem.categoryUrl}/${item.filename}`}
                                  className="text-neutral-400"
                                >
                                  {item.title}
                                </a>
                              )
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}
