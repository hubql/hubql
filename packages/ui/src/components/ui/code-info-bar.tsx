import { CheckIcon, CopyIcon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
export const CodeInfoBar = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="bg-muted h-[40px] relative flex justify-between items-center">
      <span className="pl-4 text-sm text-secondary-foreground">{language}</span>
      <button
        onClick={copyToClipboard}
        className="text-foreground text-sm bg-muted h-full hover:bg-muted active:bg-neutral-800 flex items-center px-4"
      >
        {copied ? (
          <div className="flex gap-2 items-center">
            <CheckIcon className="w-3 h-3" />
            Code Copied!
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <CopyIcon className="w-3 h-3" />
            Copy
          </div>
        )}
      </button>
    </div>
  )
}
