import Image from 'next/image'
import { Phone } from 'lucide-react'
import { CONTACTO } from '@/data/contacto'
import { cn } from '@/lib/utils'

const INICIAIS = CONTACTO.nome
  .split(' ')
  .map((p) => p[0])
  .join('')

export function FotoPia({ className, tamanho }: { className?: string; tamanho: number }) {
  if (CONTACTO.foto) {
    return (
      <Image
        src={CONTACTO.foto || '/placeholder.svg'}
        alt={`Fotografia de ${CONTACTO.nome}`}
        width={tamanho}
        height={tamanho}
        className={cn('object-cover', className)}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={`Espaço reservado para a fotografia de ${CONTACTO.nome}`}
      className={cn('flex items-center justify-center bg-primary font-semibold text-primary-foreground', className)}
    >
      <span aria-hidden="true">{INICIAIS}</span>
    </div>
  )
}

export function BotaoLigar({ className, compacto = false }: { className?: string; compacto?: boolean }) {
  return (
    <a
      href={CONTACTO.telefoneHref}
      className={cn(
        'inline-flex items-center gap-2 rounded-md bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90',
        compacto ? 'h-9 px-3 text-sm' : 'h-11 px-5',
        className,
      )}
    >
      <Phone className="size-4" aria-hidden="true" />
      <span className={compacto ? 'sr-only sm:not-sr-only' : ''}>{CONTACTO.telefone}</span>
      {compacto && <span className="sm:hidden">Ligar</span>}
    </a>
  )
}

export function CartaoConsultora() {
  return (
    <aside
      aria-label={`Contacto de ${CONTACTO.nome}`}
      className="flex flex-col gap-5 rounded-lg border bg-card p-5 text-card-foreground"
    >
      <div className="flex items-center gap-5">
        <FotoPia tamanho={160} className="size-24 shrink-0 rounded-lg text-3xl sm:h-53 sm:w-40" />
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Análise preparada por</p>
          <p className="text-xl font-semibold">{CONTACTO.nome}</p>
          <p className="text-sm text-muted-foreground">{CONTACTO.funcao}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Quer saber quanto vale a sua casa com base nestes dados? Ligue para uma avaliação sem compromisso.
      </p>
      <BotaoLigar className="justify-center" />
    </aside>
  )
}

export function SeccaoContacto() {
  return (
    <section id="contacto" aria-labelledby="titulo-contacto" className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[auto_1fr] md:py-20">
        <FotoPia
          tamanho={320}
          className="aspect-[4/5] w-48 rounded-lg bg-primary-foreground/10 text-6xl text-primary-foreground ring-1 ring-primary-foreground/20 md:w-64"
        />
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Vender ou comprar no distrito</p>
          <h2 id="titulo-contacto" className="text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            Fale com {CONTACTO.nome}
          </h2>
          <p className="max-w-xl text-lg leading-relaxed opacity-90 text-pretty">
            Os preços subiram em quase todo o distrito de Aveiro. Se está a pensar vender, este é um bom momento para
            saber quanto vale o seu imóvel. Avaliação gratuita e sem compromisso.
          </p>
          <a
            href={CONTACTO.telefoneHref}
            className="inline-flex w-fit items-center gap-3 rounded-md bg-primary-foreground px-6 py-3 text-lg font-semibold text-primary transition-opacity hover:opacity-90"
          >
            <Phone className="size-5" aria-hidden="true" />
            {CONTACTO.telefone}
          </a>
        </div>
      </div>
    </section>
  )
}
