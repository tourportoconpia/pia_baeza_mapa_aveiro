import { DEFINICAO, FONTE } from '@/data/ine-habitacao-aveiro'
import { CONTACTO } from '@/data/contacto'
import { BotaoLigar, CartaoConsultora, FotoPia } from './contacto'

const LINKS = [
  { href: '#mapa', label: 'Mapa' },
  { href: '#ovar', label: 'Ovar' },
  { href: '#sinais', label: 'Sinais' },
  { href: '#tabela', label: 'Tabela' },
  { href: '#notas', label: 'Notas' },
]

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4">
        <a href="#topo" className="flex min-w-0 max-w-[calc(100%-6rem)] items-center gap-2 sm:max-w-none sm:gap-2.5">
          <FotoPia tamanho={36} className="size-8 shrink-0 rounded-full text-xs" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-semibold">{CONTACTO.nome}</span>
            <span className="truncate text-xs text-muted-foreground">Habitação · Aveiro</span>
          </span>
        </a>
        <nav aria-label="Secções" className="flex shrink-0 items-center gap-2">
          <ul className="hidden items-center gap-1 text-sm md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <BotaoLigar compacto />
        </nav>
      </div>
    </header>
  )
}

export function Abertura() {
  return (
    <section id="topo" aria-labelledby="titulo-principal">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 pb-10 pt-12 md:grid-cols-[1.4fr_1fr] md:pt-20 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Dados INE · 1.º trimestre de 2026
          </p>
          <h1 id="titulo-principal" className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            Mapa de preços da habitação no distrito de Aveiro
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            {DEFINICAO}, em €/m², para os 19 concelhos do distrito. Compare com o trimestre anterior e com o mesmo
            período de há um ano.
          </p>
          <p className="text-sm text-muted-foreground">{FONTE}.</p>
        </div>
        <CartaoConsultora />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-14 md:pb-16">
        <dl className="grid gap-4 border-t pt-6 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <dt className="font-semibold">Preço de venda efetivo</dt>
            <dd className="leading-relaxed text-muted-foreground">Vendas concretizadas, não preços de anúncio.</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="font-semibold">Janela de 12 meses</dt>
            <dd className="leading-relaxed text-muted-foreground">
              Cada trimestre é a mediana dos últimos 12 meses (janela rolante).
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="font-semibold">Três momentos</dt>
            <dd className="leading-relaxed text-muted-foreground">1.º T 2026 · 4.º T 2025 · 1.º T 2025</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
