import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export function Empty({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4 rounded-lg p-6 text-center', className)}
      {...props}
    />
  )
}

export function EmptyHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('flex max-w-sm flex-col items-center gap-2', className)} {...props} />
}

export function EmptyMedia({ className, variant = 'default', ...props }: ComponentPropsWithoutRef<'div'> & { variant?: 'default' | 'icon' }) {
  return (
    <div
      className={cn(
        variant === 'icon' && 'flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6',
        className,
      )}
      {...props}
    />
  )
}

export function EmptyTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={cn('text-lg font-semibold tracking-tight', className)} {...props} />
}

export function EmptyDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}
