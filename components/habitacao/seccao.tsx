import { cn } from '@/lib/utils'

export function Seccao({
  id,
  etiqueta,
  titulo,
  descricao,
  children,
  className,
}: {
  id: string
  etiqueta: string
  titulo: string
  descricao?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className={cn('scroll-mt-20 border-t', className)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 md:py-20">
        <header className="flex max-w-3xl flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{etiqueta}</p>
          <h2 id={`${id}-titulo`} className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {titulo}
          </h2>
          {descricao && <p className="leading-relaxed text-muted-foreground text-pretty">{descricao}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
