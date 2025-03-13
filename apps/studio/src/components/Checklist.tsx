import React from 'react'
import { Checkbox } from '@hubql/ui/checkbox'
import { Alert, AlertTitle, AlertDescription } from '@hubql/ui/alert'

const checklistData = ['Checklist item 1', 'Checklist item 2', 'Checklist item 3']

export const Checklist = ({ checklist = checklistData }: { checklist?: string[] }) => {
  const [checkedItems, setCheckedItems] = React.useState<{ [key: string]: boolean }>({})

  const handleCheck = (item: string, checked: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: checked,
    }))
  }

  // Use optional chaining with nullish coalescing to handle undefined checklist
  const allChecked =
    (checklist?.length > 0 && checklist.every((item) => checkedItems[item])) ?? false

  return (
    <div className="h-full border-l border-border w-80 p-2">
      <h2 className="text-lg font-medium text-foreground">Checklist</h2>
      <div className="flex flex-col gap-2 mt-2">
        {checklist?.map((item) => (
          <div key={'list-' + item} className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              id={item}
              checked={checkedItems[item] || false}
              onCheckedChange={(checked) => handleCheck(item, checked as boolean)}
            />
            <label
              className={
                checkedItems[item] ? 'line-through text-muted-foreground' : 'cursor-pointer'
              }
              htmlFor={item}
            >
              {item}
            </label>
          </div>
        ))}
      </div>
      {allChecked && (
        <Alert className="mt-2">
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>🎉 All items completed! </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
