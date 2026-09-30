import { CODIGO_OVAR, CONCELHOS, type Concelho } from '@/data/ine-habitacao-aveiro'
import { fmtNum, varHom, varTrim } from '@/lib/habitacao'
import { cn } from '@/lib/utils'
import { Variacao } from './variacao'

type Linha = { concelho: Concelho; principal: string; variacao: number | null }

function CartaoSinal({ titulo, leitura, linhas }: { titulo: string; leitura: string; linhas: Linha[] }) {
  return (
    <article className="flex flex-col gap-4 overflow-hidden rounded-xl border bg-card p-4 sm:p-5">
      <header className="flex flex-col gap-1.5">
        <h3 className="font-semibold text-balance">{titulo}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{leitura}</p>
      </header>
      <ol className="flex flex-col divide-y text-sm">
        {linhas.map(({ concelho, principal, variacao }) => (
          <li
            key={concelho.codigo}
            className={cn(
              'flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2 sm:flex-nowrap',
              concelho.codigo === CODIGO_OVAR && 'font-semibold',
            )}
          >
            <span className="min-w-0 max-w-full truncate">{concelho.nome}</span>
            <span className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
              <span className="font-mono text-xs text-muted-foreground tabular-nums sm:text-sm">{principal}</span>
              <Variacao valor={variacao} className="min-w-14 justify-end text-right" />
            </span>
          </li>
        ))}
      </ol>
    </article>
  )
}

export function SinaisMercado() {
  const valorizacao = [...CONCELHOS]
    .sort((a, b) => (varHom(b) ?? 0) - (varHom(a) ?? 0))
    .slice(0, 5)
    .map((c) => ({ concelho: c, principal: `${fmtNum(c.dados['2026T1'].total)} €`, variacao: varHom(c) }))

  const liquidez = [...CONCELHOS]
    .sort((a, b) => b.dados['2026T1'].vendas - a.dados['2026T1'].vendas)
    .slice(0, 5)
    .map((c) => ({ concelho: c, principal: `${fmtNum(c.dados['2026T1'].vendas)} vendas`, variacao: varHom(c, 'vendas') }))

  const escassez = CONCELHOS.filter((c) => (varTrim(c) ?? 0) > 0 && (varTrim(c, 'vendas') ?? 0) < 0)
    .sort((a, b) => (varTrim(b) ?? 0) - (varTrim(a) ?? 0))
    .slice(0, 6)
    .map((c) => ({
      concelho: c,
      principal: `vendas ${fmtNum(c.dados['2025T4'].vendas)}→${fmtNum(c.dados['2026T1'].vendas)}`,
      variacao: varTrim(c),
    }))

  const procura = CONCELHOS.filter((c) => (varHom(c, 'vendas') ?? 0) > 0)
    .sort((a, b) => (varHom(b, 'vendas') ?? 0) - (varHom(a, 'vendas') ?? 0))
    .slice(0, 6)
    .map((c) => ({
      concelho: c,
      principal: `${fmtNum(c.dados['2025T1'].vendas)}→${fmtNum(c.dados['2026T1'].vendas)}`,
      variacao: varHom(c, 'vendas'),
    }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CartaoSinal
        titulo="Maior valorização em 1 ano"
        leitura="Proprietários destes concelhos viram o valor das casas subir mais. Bom argumento para contactar quem pondera vender."
        linhas={valorizacao}
      />
      <CartaoSinal
        titulo="Preço a subir, vendas a descer"
        leitura="Do 4.º T 2025 para o 1.º T 2026 o preço subiu mas houve menos vendas. Pode indicar falta de casas à venda: foco em angariar."
        linhas={escassez}
      />
      <CartaoSinal
        titulo="Mais vendas do que há 1 ano"
        leitura="Mais transações do que no mesmo período de 2025. A procura está a ganhar força nestes concelhos."
        linhas={procura}
      />
      <CartaoSinal
        titulo="Mercados com mais movimento"
        leitura="Onde se vende mais em número absoluto (últimos 12 meses). Mais compradores e vendedores ativos."
        linhas={liquidez}
      />
    </div>
  )
}
