'use client'

import { useMemo } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import type { FeatureCollection } from 'geojson'
import { CODIGO_OVAR } from '@/data/ine-habitacao-aveiro'
import type { ConcelhoFeature } from '@/lib/geo-concelhos'
import { obterConcelho } from '@/lib/habitacao'

const LARGURA = 520
const ALTURA = 660

type Props = {
  features: ConcelhoFeature[]
  corDe: (codigo: string) => string
  descricaoDe: (codigo: string) => string
  selecionado: string
  emFoco: string | null
  onSelecionar: (codigo: string) => void
  onFoco: (codigo: string | null) => void
}

export function MapaSvg({ features, corDe, descricaoDe, selecionado, emFoco, onSelecionar, onFoco }: Props) {
  const formas = useMemo(() => {
    const colecao: FeatureCollection = { type: 'FeatureCollection', features }
    const projecao = geoMercator().fitExtent(
      [
        [12, 12],
        [LARGURA - 12, ALTURA - 12],
      ],
      colecao,
    )
    const caminho = geoPath(projecao)
    return features.map((f) => ({
      codigo: f.properties.codigo,
      d: caminho(f) ?? '',
      centro: caminho.centroid(f),
    }))
  }, [features])

  const ordenadas = [...formas].sort((a, b) => {
    const peso = (c: string) => (c === selecionado ? 2 : c === emFoco ? 1 : 0)
    return peso(a.codigo) - peso(b.codigo)
  })

  const rotulos = formas.filter((f) => f.codigo === selecionado || f.codigo === emFoco || f.codigo === CODIGO_OVAR)

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      className="h-auto w-full"
      role="group"
      aria-label="Mapa interativo dos 19 concelhos do distrito de Aveiro"
      onMouseLeave={() => onFoco(null)}
    >
      {ordenadas.map((f) => {
        const ativo = f.codigo === selecionado
        const foco = f.codigo === emFoco
        return (
          <path
            key={f.codigo}
            d={f.d}
            role="button"
            tabIndex={0}
            aria-pressed={ativo}
            aria-label={descricaoDe(f.codigo)}
            onClick={() => onSelecionar(f.codigo)}
            onMouseEnter={() => onFoco(f.codigo)}
            onFocus={() => onFoco(f.codigo)}
            onBlur={() => onFoco(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelecionar(f.codigo)
              }
            }}
            className="cursor-pointer outline-none transition-[fill] duration-300"
            style={{
              fill: corDe(f.codigo),
              stroke: ativo ? 'var(--foreground)' : foco ? 'var(--foreground)' : 'var(--card)',
              strokeWidth: ativo ? 2.5 : foco ? 1.5 : 1,
              strokeLinejoin: 'round',
            }}
          />
        )
      })}
      {rotulos.map((f) => {
        const nome = obterConcelho(f.codigo)?.nome ?? ''
        const destaque = f.codigo === selecionado || f.codigo === emFoco
        return (
          <g key={`r-${f.codigo}`} pointerEvents="none" aria-hidden="true">
            <circle cx={f.centro[0]} cy={f.centro[1]} r={3} style={{ fill: 'var(--foreground)' }} />
            <text
              x={f.centro[0] + 6}
              y={f.centro[1] + 4}
              className="font-sans"
              style={{
                fontSize: destaque ? 14 : 12,
                fontWeight: destaque ? 600 : 500,
                fill: 'var(--foreground)',
                stroke: 'var(--card)',
                strokeWidth: 4,
                paintOrder: 'stroke',
                strokeLinejoin: 'round',
              }}
            >
              {nome}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
