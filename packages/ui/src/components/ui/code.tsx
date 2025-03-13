import React from 'react'
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter'
import { CodeInfoBar } from './code-info-bar'

interface CodeProps {
  code: string | null
  language: 'json' | 'plaintext' | 'bash' | 'javascript'
  showInfoBar?: boolean
}

export const Code: React.FC<CodeProps> = ({ code, language, showInfoBar = false }) => {
  if (!code) return null
  return (
    <div className="text-sm flex flex-col gap-0 w-full h-full">
      {showInfoBar && <CodeInfoBar code={code} language={language} />}
      <SyntaxHighlighter
        style={customStyle}
        language={language}
        showLineNumbers={false}
        className="scrollbar codeSyntaxHighlighter"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

const customStyle: SyntaxHighlighterProps['style'] = {
  'pre[class*="language-"]': {
    background: 'var(--muted)',
    color: 'var(--text)',
    fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: '0.95em',
    lineHeight: '1.5em',
    padding: '1rem',
    boxSizing: 'border-box',
    display: 'inline-block',
    width: '100%',
    maxHeight: '400px',
    overflow: 'auto',
  },
}
