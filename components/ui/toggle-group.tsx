import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type ToggleGroupProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & {
  variant?: 'default' | 'outline'
}

export function ToggleGroup({ className, variant = 'default', ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-variant={variant}
      className={cn('inline-flex items-center justify-center gap-1', className)}
      {...props}
    />
  )
}

export function ToggleGroupItem({ className, ...props }: ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        'inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[variant=outline]:border data-[variant=outline]:border-input',
        className,
      )}
      {...props}
    />
  )
}
