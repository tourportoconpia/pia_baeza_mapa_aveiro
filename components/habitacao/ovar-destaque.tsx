import {
  CODIGO_OVAR,
  CONTINENTE,
  REGIAO_AVEIRO_REFERENCIA,
  VIZINHOS_OVAR,
  type Concelho,
} from '@/data/ine-habitacao-aveiro'
import { fmtNum, fmtPct, obterConcelho, posicao, resumoPartilhavel, variacao, varHom, varTrim } from '@/lib/habitacao'
import { cn } from '@/lib/utils'
import { Variacao } from './variacao'
import { BotaoCopiar } from './botao-copiar'

function Indicador({
  titulo,
  valor,
  unidade,
  trim,
  hom,
}: {
  titulo: string
  valor: number | null
  unidade: string
  trim: number | null
  hom: number | null
}) {
  return (
    <div className="flex flex-col gap-3 bg-card p-5">
      <h3 className="text-sm text-muted-foreground">{titulo}</h3>
      <p className="font-mono text-3xl font-semibold tabular-nums tracking-tight">
        {fmtNum(valor)}
        <span className="ml-1 text-sm font-normal text-muted-foreground">{unidade}</span>
      </p>
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-muted-foreground">vs. 4.º T 2025</dt>
          <dd>
            <Variacao valor={trim} />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-muted-foreground">vs. 1.º T 2025</dt>
          <dd>
            <Variacao valor={hom} />
          </dd>
        </div>
      </dl>
    </div>
  )
}

export function OvarDestaque() {
  const ovar = obterConcelho(CODIGO_OVAR) as Concelho
  const atual = ovar.dados['2026T1']
  const aveiro = obterConcelho('0105') as Concelho

  const comparacoes = [
    { nome: REGIAO_AVEIRO_REFERENCIA.nome, valor: REGIAO_AVEIRO_REFERENCIA.total, nota: true },
    { nome: 'Continente', valor: CONTINENTE.dados['2026T1'].total },
    { nome: 'Concelho de Aveiro', valor: aveiro.dados['2026T1'].total },
  ]

  const vizinhos = [ovar, ...VIZINHOS_OVAR.map((c) => obterConcelho(c) as Concelho)].sort(
    (a, b) => b.dados['2026T1'].total - a.dados['2026T1'].total,
  )
  const maxVizinhos = vizinhos[0].dados['2026T1'].total

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Indicador titulo="Preço mediano — total" valor={atual.total} unidade="€/m²" trim={varTrim(ovar)} hom={varHom(ovar)} />
        <Indicador
          titulo="Casas existentes"
          valor={atual.existentes}
          unidade="€/m²"
          trim={varTrim(ovar, 'existentes')}
          hom={varHom(ovar, 'existentes')}
        />
        <Indicador
          titulo="Casas novas"
          valor={atual.novos}
          unidade="€/m²"
          trim={varTrim(ovar, 'novos')}
          hom={varHom(ovar, 'novos')}
        />
        <Indicador
          titulo="Vendas (últimos 12 meses)"
          valor={atual.vendas}
          unidade="vendas"
          trim={varTrim(ovar, 'vendas')}
          hom={varHom(ovar, 'vendas')}
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">O que os números dizem</h3>
          <ul className="flex flex-col gap-3 text-pretty leading-relaxed">
            <li>
              Em 12 meses o preço mediano passou de <strong className="font-mono">{fmtNum(ovar.dados['2025T1'].total)}</strong>{' '}
              para <strong className="font-mono">{fmtNum(atual.total)} €/m²</strong> ({fmtPct(varHom(ovar))}). Só do 4.º
              trimestre de 2025 para o 1.º de 2026 subiu {fmtPct(varTrim(ovar))}.
            </li>
            <li>
              As <strong>casas existentes</strong> são o segmento que mais puxa a subida: de{' '}
              {fmtNum(ovar.dados['2025T1'].existentes)} para {fmtNum(atual.existentes)} €/m² (
              {fmtPct(varHom(ovar, 'existentes'))} num ano). As casas novas ficaram praticamente estáveis (
              {fmtPct(varHom(ovar, 'novos'))}).
            </li>
            <li>
              O número de vendas baixou ligeiramente: {fmtNum(ovar.dados['2025T4'].vendas)} no trimestre anterior,{' '}
              {fmtNum(atual.vendas)} agora. Preços a subir com menos vendas pode indicar pouca oferta no mercado.
            </li>
            <li>
              Ovar é o {posicao(CODIGO_OVAR, 'total')}.º concelho mais caro do distrito (empatado com São João da
              Madeira), mas continua {fmtPct(Math.abs(variacao(atual.total, CONTINENTE.dados['2026T1'].total) ?? 0)).replace('+', '')}{' '}
              abaixo do Continente.
            </li>
          </ul>
          <div className="flex flex-col gap-3 rounded-lg bg-muted p-4">
            <p className="text-sm leading-relaxed text-pretty">{resumoPartilhavel(ovar)}</p>
            <div>
              <BotaoCopiar texto={resumoPartilhavel(ovar)} rotulo="Copiar texto" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Ovar comparado (1.º T 2026)</h3>
            <ul className="flex flex-col divide-y overflow-hidden rounded-lg border bg-card">
              {comparacoes.map((c) => (
                <li key={c.nome} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <span>
                    {c.nome}
                    {c.nota && <sup className="text-muted-foreground">*</sup>}
                    <span className="ml-2 font-mono text-muted-foreground tabular-nums">{fmtNum(c.valor)} €/m²</span>
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-muted-foreground">Ovar</span>
                    <Variacao valor={variacao(atual.total, c.valor)} className="font-semibold" />
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              * Valor de referência para a sub-região NUTS III Região de Aveiro, que inclui Ovar e mais 10 concelhos.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Ovar e os concelhos vizinhos</h3>
            <ul className="flex flex-col gap-2.5">
              {vizinhos.map((c) => {
                const v = c.dados['2026T1'].total
                const eOvar = c.codigo === CODIGO_OVAR
                return (
                  <li key={c.codigo} className="grid grid-cols-[minmax(0,7rem)_1fr_3.5rem] items-center gap-2 sm:grid-cols-[8.5rem_1fr_3.5rem] sm:gap-3 text-sm">
                    <span className={cn('truncate', eOvar && 'font-semibold')}>{c.nome}</span>
                    <span className="h-3 rounded-sm bg-muted" aria-hidden="true">
                      <span
                        className={cn('block h-full rounded-sm', eOvar ? 'bg-accent' : 'bg-primary')}
                        style={{ width: `${(v / maxVizinhos) * 100}%` }}
                      />
                    </span>
                    <span className="text-right font-mono tabular-nums">{fmtNum(v)}</span>
                  </li>
                )
              })}
            </ul>
            <p className="text-xs text-muted-foreground">
              Total €/m². Quem acha Espinho caro encontra em Ovar um valor cerca de{' '}
              {fmtPct(Math.abs(variacao(atual.total, 2776) ?? 0)).replace('+', '')} mais baixo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
