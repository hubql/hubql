import { MergeOptions } from './types'

export function mergeCustomContent({ baseMdx, customMdx }: MergeOptions): string {
  return `${baseMdx}\n\n<!-- Custom content -->\n${customMdx}`
}
