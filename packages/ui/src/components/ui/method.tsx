import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@hubql/ui/lib/utils'
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options'

const MethodVariants = cva(
  'inline-flex items-center uppercase justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all ease-in duration-100 tracking-wide rounded-sm font-bold',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground border border-primary-foreground',
        post: 'text-emerald-400 border border-emerald-400/20',
        get: 'text-sky-500 border border-sky-500/20',
        put: 'text-yellow-500 border border-yellow-500/20',
        delete: 'text-red-500 border border-red-500/20',
        patch: 'text-secondary-foreground border border-neutral-400/20',
        options: 'text-secondary-foreground border border-neutral-400/20',
      } as Record<string | HttpMethod, string>,
      size: {
        default: 'h-10 px-4 py-2 ',
        xs: 'w-fit text-[10px] min-w-[48px] w-[48px] justify-center',
        sm: 'text-sm !border-0',
        lg: 'h-11 px-8 text-sm',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface MethodProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof MethodVariants> {
  asChild?: boolean
}

const Method = React.forwardRef<HTMLDivElement, MethodProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'
    return (
      <Comp className={cn(MethodVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Method.displayName = 'Method'

export { Method, MethodVariants }
