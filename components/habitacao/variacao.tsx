import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fmtPct } from '@/lib/habitacao'

export function Variacao({ valor, className }: { valor: number | null; className?: string }) {
  if (valor == null) return <span className={cn('font-mono text-muted-foreground', className)}>—</span>
  const Icone = valor > 0.05 ? ArrowUpRight : valor < -0.05 ? ArrowDownRight : Minus
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 font-mono tabular-nums',
        valor < -0.05 ? 'text-descida' : 'text-primary',
        className,
      )}
    >
      <Icone className="size-3.5" aria-hidden="true" />
      {fmtPct(valor)}
    </span>
  )
}
