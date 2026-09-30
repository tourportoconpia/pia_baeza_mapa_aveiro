'use client'

import { useMemo, useState } from 'react'
import { MapPinOff } from 'lucide-react'
import { CODIGO_OVAR, CONCELHOS, PERIODOS, type PeriodoId } from '@/data/ine-habitacao-aveiro'
import type { ConcelhoFeature } from '@/lib/geo-concelhos'
import { construirEscala, SEM_DADOS } from '@/lib/escala-mapa'
import { METRICAS, fmtMetrica, obterConcelho, valorMetrica, type Metrica } from '@/lib/habitacao'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { MapaSvg } from './mapa-svg'
import { PainelConcelho } from './painel-concelho'

const CONCELHOS_ORDENADOS = [...CONCELHOS].sort((a, b) => a.nome.localeCompare(b.nome, 'pt'))

export function MapaExplorador({ features }: { features: ConcelhoFeature[] | null }) {
  const [metrica, setMetrica] = useState<Metrica>('total')
  const [periodo, setPeriodo] = useState<PeriodoId>('2026T1')
  const [selecionado, setSelecionado] = useState(CODIGO_OVAR)
  const [emFoco, setEmFoco] = useState<string | null>(null)

  const escala = useMemo(() => construirEscala(metrica, periodo), [metrica, periodo])
  const eVariacao = metrica === 'varTrim' || metrica === 'varHom'
  const metricaInfo = METRICAS.find((m) => m.id === metrica)!

  const valorDe = (codigo: string) => {
    const c = obterConcelho(codigo)
    return c ? valorMetrica(c, metrica, periodo) : null
  }

  const codigoInfo = emFoco ?? selecionado
  const concelhoInfo = obterConcelho(codigoInfo)!
  const concelhoSelecionado = obterConcelho(selecionado)!

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="metrica" className="text-xs font-medium text-muted-foreground">
              O que mostrar
            </label>
            <Select value={metrica} onValueChange={(v) => setMetrica(v as Metrica)}>
              <SelectTrigger id="metrica" className="w-full bg-card sm:w-72">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METRICAS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span id="periodo-label" className="text-xs font-medium text-muted-foreground">
              Período
            </span>
            <ToggleGroup
              type="single"
              variant="outline"
              value={eVariacao ? '' : periodo}
              onValueChange={(v) => v && setPeriodo(v as PeriodoId)}
              disabled={eVariacao}
              aria-labelledby="periodo-label"
              className="bg-card"
            >
              {PERIODOS.map((p) => (
                <ToggleGroupItem key={p.id} value={p.id} className="px-3 text-xs" aria-label={p.label}>
                  {p.curto}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        {eVariacao && (
          <p className="text-xs text-muted-foreground">
            {metrica === 'varTrim'
              ? 'Compara o preço total do 1.º T 2026 com o do 4.º T 2025.'
              : 'Compara o preço total do 1.º T 2026 com o do 1.º T 2025.'}
          </p>
        )}

        <div className="relative overflow-hidden rounded-xl border bg-card">
          {features ? (
            <>
              <MapaSvg
                features={features}
                corDe={(codigo) => escala.cor(valorDe(codigo))}
                descricaoDe={(codigo) =>
                  `${obterConcelho(codigo)?.nome}: ${fmtMetrica(valorDe(codigo), metrica)}`
                }
                selecionado={selecionado}
                emFoco={emFoco}
                onSelecionar={setSelecionado}
                onFoco={setEmFoco}
              />
              <div className="pointer-events-none absolute left-3 top-3 flex max-w-[60%] flex-col gap-0.5 rounded-md border bg-card/95 px-3 py-2 shadow-sm">
                <span className="text-xs text-muted-foreground">{metricaInfo.curto}</span>
                <span className="text-sm font-semibold">{concelhoInfo.nome}</span>
                <span className="font-mono text-lg font-semibold tabular-nums">
                  {fmtMetrica(valorDe(codigoInfo), metrica)}
                </span>
              </div>
            </>
          ) : (
            <Empty className="min-h-80">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MapPinOff />
                </EmptyMedia>
                <EmptyTitle>Mapa temporariamente indisponível</EmptyTitle>
                <EmptyDescription>
                  Não foi possível carregar os limites dos concelhos. Pode escolher o concelho na lista ao lado.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs" aria-label="Legenda do mapa">
          {escala.legenda.map((item) => (
            <li key={item.rotulo} className="flex items-center gap-1.5">
              <span className="size-3.5 rounded-sm border" style={{ background: item.cor }} aria-hidden="true" />
              <span className="font-mono tabular-nums">{item.rotulo}</span>
            </li>
          ))}
          {metrica === 'novos' && (
            <li className="flex items-center gap-1.5">
              <span className="size-3.5 rounded-sm border" style={{ background: SEM_DADOS }} aria-hidden="true" />
              <span>Sem valor publicado</span>
            </li>
          )}
        </ul>
        <p className="text-xs text-muted-foreground">
          Clique num concelho (ou use Tab + Enter) para ver o detalhe. Cores por quintis: cada tom agrupa cerca de 4
          concelhos.
        </p>
      </div>

      <aside className="flex flex-col gap-5 rounded-xl border bg-card p-5 md:p-6" aria-label="Detalhe do concelho">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="concelho" className="text-xs font-medium text-muted-foreground">
            Concelho
          </label>
          <Select value={selecionado} onValueChange={setSelecionado}>
            <SelectTrigger id="concelho" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONCELHOS_ORDENADOS.map((c) => (
                <SelectItem key={c.codigo} value={c.codigo}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <PainelConcelho concelho={concelhoSelecionado} />
      </aside>
    </div>
  )
}
