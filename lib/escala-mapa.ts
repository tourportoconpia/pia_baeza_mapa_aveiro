import { CONCELHOS, type PeriodoId } from '@/data/ine-habitacao-aveiro'
import { fmtNum, fmtPct, valorMetrica, type Metrica } from '@/lib/habitacao'

export type ItemLegenda = { cor: string; rotulo: string }
export type Escala = { cor: (v: number | null) => string; legenda: ItemLegenda[] }

const tom = (pct: number) => `color-mix(in oklch, var(--primary) ${pct}%, var(--card))`
const TONS = [tom(12), tom(30), tom(50), tom(72), tom(100)]
const NEGATIVO = 'color-mix(in oklch, var(--accent) 90%, var(--card))'
export const SEM_DADOS = 'var(--muted)'

const LIMIARES_VARIACAO: Record<'varTrim' | 'varHom', number[]> = {
  varTrim: [0, 3, 6, 9],
  varHom: [0, 10, 20, 30],
}

function quantis(valores: number[], n: number) {
  const ordenados = [...valores].sort((a, b) => a - b)
  return Array.from({ length: n - 1 }, (_, i) => ordenados[Math.round(((i + 1) / n) * (ordenados.length - 1))])
}

export function construirEscala(metrica: Metrica, periodo: PeriodoId): Escala {
  if (metrica === 'varTrim' || metrica === 'varHom') {
    const [l0, l1, l2, l3] = LIMIARES_VARIACAO[metrica]
    const cores = [NEGATIVO, TONS[1], TONS[2], TONS[3], TONS[4]]
    return {
      cor: (v) => {
        if (v == null) return SEM_DADOS
        if (v < l0) return cores[0]
        if (v < l1) return cores[1]
        if (v < l2) return cores[2]
        if (v < l3) return cores[3]
        return cores[4]
      },
      legenda: [
        { cor: cores[0], rotulo: 'Desceu' },
        { cor: cores[1], rotulo: `0 a ${l1}%` },
        { cor: cores[2], rotulo: `${l1} a ${l2}%` },
        { cor: cores[3], rotulo: `${l2} a ${l3}%` },
        { cor: cores[4], rotulo: `${fmtPct(l3)} ou mais` },
      ],
    }
  }

  const valores = CONCELHOS.map((c) => valorMetrica(c, metrica, periodo)).filter((v): v is number => v != null)
  const limites = quantis(valores, 5)
  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const bordas = [min, ...limites, max]

  return {
    cor: (v) => {
      if (v == null) return SEM_DADOS
      const i = limites.findIndex((l) => v < l)
      return TONS[i === -1 ? TONS.length - 1 : i]
    },
    legenda: TONS.map((cor, i) => ({
      cor,
      rotulo: `${fmtNum(bordas[i])} – ${fmtNum(bordas[i + 1])}`,
    })),
  }
}
