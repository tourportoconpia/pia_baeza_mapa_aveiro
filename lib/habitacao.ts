import {
  CONCELHOS,
  CONTINENTE,
  DEFINICAO,
  FONTE,
  PERIODOS,
  PERIODO_ANTERIOR,
  PERIODO_ATUAL,
  PERIODO_HOMOLOGO,
  type Concelho,
  type PeriodoId,
  type Registo,
} from '@/data/ine-habitacao-aveiro'

export type Campo = keyof Registo
export type Metrica = Campo | 'varTrim' | 'varHom'

export const METRICAS: { id: Metrica; label: string; curto: string }[] = [
  { id: 'total', label: 'Preço mediano — total (€/m²)', curto: 'Total €/m²' },
  { id: 'existentes', label: 'Preço mediano — existentes (€/m²)', curto: 'Existentes €/m²' },
  { id: 'novos', label: 'Preço mediano — novos (€/m²)', curto: 'Novos €/m²' },
  { id: 'vendas', label: 'N.º de vendas (últimos 12 meses)', curto: 'N.º vendas' },
  { id: 'varTrim', label: 'Variação vs. trimestre anterior (%)', curto: 'Δ trimestre' },
  { id: 'varHom', label: 'Variação vs. 1 ano antes (%)', curto: 'Δ 1 ano' },
]

const numberFormat = new Intl.NumberFormat('pt-PT', {
  maximumFractionDigits: 0,
  useGrouping: 'always',
} as Intl.NumberFormatOptions)

export function fmtNum(v: number | null | undefined) {
  return v == null ? '—' : numberFormat.format(v)
}

export function fmtEur(v: number | null | undefined) {
  return v == null ? '—' : `${numberFormat.format(v)} €/m²`
}

export function fmtPct(v: number | null | undefined) {
  if (v == null) return '—'
  const sign = v > 0 ? '+' : v < 0 ? '−' : ''
  return `${sign}${Math.abs(v).toFixed(1).replace('.', ',')}%`
}

export function variacao(atual: number | null, anterior: number | null) {
  if (atual == null || anterior == null || anterior === 0) return null
  return (atual / anterior - 1) * 100
}

export function periodoLabel(id: PeriodoId) {
  return PERIODOS.find((p) => p.id === id)?.label ?? id
}

export function obterConcelho(codigo: string) {
  return CONCELHOS.find((c) => c.codigo === codigo)
}

export function varTrim(c: Concelho, campo: Campo = 'total') {
  return variacao(c.dados[PERIODO_ATUAL][campo], c.dados[PERIODO_ANTERIOR][campo])
}

export function varHom(c: Concelho, campo: Campo = 'total') {
  return variacao(c.dados[PERIODO_ATUAL][campo], c.dados[PERIODO_HOMOLOGO][campo])
}

export function valorMetrica(c: Concelho, metrica: Metrica, periodo: PeriodoId): number | null {
  if (metrica === 'varTrim') return varTrim(c)
  if (metrica === 'varHom') return varHom(c)
  return c.dados[periodo][metrica]
}

export function fmtMetrica(v: number | null, metrica: Metrica) {
  if (metrica === 'varTrim' || metrica === 'varHom') return fmtPct(v)
  if (metrica === 'vendas') return `${fmtNum(v)} vendas`
  return fmtEur(v)
}

/** Posição (1 = mais alto) com empates partilhados. */
export function posicao(codigo: string, campo: Campo, periodo: PeriodoId = PERIODO_ATUAL) {
  const alvo = obterConcelho(codigo)?.dados[periodo][campo]
  if (alvo == null) return null
  const acima = CONCELHOS.filter((c) => (c.dados[periodo][campo] ?? -Infinity) > alvo).length
  return acima + 1
}

export function vsContinente(c: Concelho, campo: Campo = 'total', periodo: PeriodoId = PERIODO_ATUAL) {
  return variacao(c.dados[periodo][campo], CONTINENTE.dados[periodo][campo])
}

export function resumoPartilhavel(c: Concelho) {
  const atual = c.dados[PERIODO_ATUAL]
  const trim = varTrim(c)
  const hom = varHom(c)
  const cont = vsContinente(c)
  const relCont =
    cont == null ? '' : ` Fica ${fmtPct(Math.abs(cont)).replace('+', '')} ${cont < 0 ? 'abaixo' : 'acima'} do Continente.`
  return (
    `${c.nome} — ${DEFINICAO.toLowerCase()}: ${fmtEur(atual.total)} no 1.º trimestre de 2026 ` +
    `(${fmtPct(trim)} face ao 4.º trimestre de 2025 e ${fmtPct(hom)} face ao 1.º trimestre de 2025).` +
    `${relCont} Foram registadas ${fmtNum(atual.vendas)} vendas nos últimos 12 meses. ` +
    `Preço de venda efetivo, não preço de anúncio. ${FONTE}.`
  )
}

export function paraCsv() {
  const cabecalho = ['Período', 'Concelho', 'Sub-região (NUTS III)', 'Total €/m²', 'Novos €/m²', 'Existentes €/m²', 'N.º vendas']
  const linhas: (string | number)[][] = []
  for (const p of PERIODOS) {
    for (const c of CONCELHOS) {
      const d = c.dados[p.id]
      linhas.push([p.label, c.nome, c.subRegiao, d.total, d.novos ?? '', d.existentes, d.vendas])
    }
    const d = CONTINENTE.dados[p.id]
    linhas.push([p.label, CONTINENTE.nome, '', d.total, d.novos ?? '', d.existentes, d.vendas])
  }
  const escapar = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  return [cabecalho, ...linhas].map((l) => l.map(escapar).join(';')).join('\n') + `\n${escapar(FONTE)}`
}
