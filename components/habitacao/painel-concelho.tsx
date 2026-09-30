import { CONCELHOS, PERIODOS, type Concelho } from '@/data/ine-habitacao-aveiro'
import { fmtEur, fmtNum, posicao, resumoPartilhavel, varHom, varTrim, vsContinente } from '@/lib/habitacao'
import { Variacao } from './variacao'
import { BotaoCopiar } from './botao-copiar'
import { ASSINATURA } from '@/data/contacto'

const CRONOLOGICO = [...PERIODOS].reverse()

export function PainelConcelho({ concelho }: { concelho: Concelho }) {
  const atual = concelho.dados['2026T1']
  const rank = posicao(concelho.codigo, 'total')
  const cont = vsContinente(concelho)
  const maxTotal = Math.max(...CRONOLOGICO.map((p) => concelho.dados[p.id].total))

  return (
    <article className="flex flex-col gap-6" aria-live="polite">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{concelho.subRegiao}</p>
        <h3 className="text-2xl font-semibold text-balance">{concelho.nome}</h3>
      </header>

      <div className="flex flex-col gap-2">
        <p className="font-mono text-4xl font-semibold tabular-nums tracking-tight">
          {fmtNum(atual.total)}
          <span className="ml-1 text-base font-normal text-muted-foreground">€/m²</span>
        </p>
        <p className="text-sm text-muted-foreground">Total, 1.º trimestre de 2026</p>
        <dl className="grid grid-cols-2 gap-3 pt-2 text-sm">
          <div className="flex flex-col gap-0.5 rounded-md bg-muted p-3">
            <dt className="text-muted-foreground">vs. trimestre anterior</dt>
            <dd>
              <Variacao valor={varTrim(concelho)} className="text-base font-semibold" />
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-muted p-3">
            <dt className="text-muted-foreground">vs. 1 ano antes</dt>
            <dd>
              <Variacao valor={varHom(concelho)} className="text-base font-semibold" />
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-muted p-3">
            <dt className="text-muted-foreground">vs. Continente</dt>
            <dd>
              <Variacao valor={cont} className="text-base font-semibold" />
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-muted p-3">
            <dt className="text-muted-foreground">Posição no distrito</dt>
            <dd className="font-mono text-base font-semibold tabular-nums">
              {rank}.º de {CONCELHOS.length}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold">Evolução do preço total</h4>
        <ul className="flex flex-col gap-2">
          {CRONOLOGICO.map((p) => {
            const v = concelho.dados[p.id].total
            return (
              <li key={p.id} className="grid grid-cols-[5.5rem_1fr_4.5rem] items-center gap-3 text-sm">
                <span className="text-muted-foreground">{p.curto}</span>
                <span className="h-2.5 rounded-full bg-muted" aria-hidden="true">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${(v / maxTotal) * 100}%` }}
                  />
                </span>
                <span className="text-right font-mono tabular-nums">{fmtNum(v)}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="w-full overflow-x-auto [scrollbar-width:thin] [scrollbar-color:oklch(var(--muted-foreground)/0.4)_transparent] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
        <table className="w-full min-w-[280px] text-sm">
          <caption className="sr-only">Valores de {concelho.nome} por período</caption>
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th scope="col" className="py-2 pr-2 font-medium">Período</th>
              <th scope="col" className="py-2 px-2 text-right font-medium">Novos</th>
              <th scope="col" className="py-2 px-2 text-right font-medium">Existentes</th>
              <th scope="col" className="py-2 pl-2 text-right font-medium">Vendas</th>
            </tr>
          </thead>
          <tbody>
            {PERIODOS.map((p) => {
              const d = concelho.dados[p.id]
              return (
                <tr key={p.id} className="border-b last:border-0">
                  <th scope="row" className="py-2 pr-2 text-left font-normal">
                    {p.curto}
                  </th>
                  <td className="py-2 px-2 text-right font-mono tabular-nums">{fmtNum(d.novos)}</td>
                  <td className="py-2 px-2 text-right font-mono tabular-nums">{fmtNum(d.existentes)}</td>
                  <td className="py-2 pl-2 text-right font-mono tabular-nums">{fmtNum(d.vendas)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="pt-2 text-xs text-muted-foreground">
          Novos e existentes em €/m². «—» = sem valor publicado pelo INE.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
          <BotaoCopiar
            texto={`${resumoPartilhavel(concelho)}\n\n${ASSINATURA}`}
            rotulo="Copiar resumo para partilhar"
          />
          <span className="text-xs text-muted-foreground">Inclui a fonte INE e o contacto.</span>
      </div>
    </article>
  )
}
