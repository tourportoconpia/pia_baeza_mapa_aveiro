'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, Download } from 'lucide-react'
import { CODIGO_OVAR, CONCELHOS, CONTINENTE, type Concelho, type SubRegiao } from '@/data/ine-habitacao-aveiro'
import { fmtNum, paraCsv, varHom, varTrim, variacao } from '@/lib/habitacao'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Variacao } from './variacao'

type Coluna = {
  id: string
  titulo: string
  valor: (c: Concelho) => number | string | null
  tipo: 'texto' | 'numero' | 'pct'
}

const COLUNAS: Coluna[] = [
  { id: 'nome', titulo: 'Concelho', valor: (c) => c.nome, tipo: 'texto' },
  { id: 'total', titulo: 'Total €/m²', valor: (c) => c.dados['2026T1'].total, tipo: 'numero' },
  { id: 'varTrim', titulo: 'vs. 4.º T 25', valor: (c) => varTrim(c), tipo: 'pct' },
  { id: 'varHom', titulo: 'vs. 1.º T 25', valor: (c) => varHom(c), tipo: 'pct' },
  { id: 'novos', titulo: 'Novos €/m²', valor: (c) => c.dados['2026T1'].novos, tipo: 'numero' },
  { id: 'existentes', titulo: 'Existentes €/m²', valor: (c) => c.dados['2026T1'].existentes, tipo: 'numero' },
  { id: 'vendas', titulo: 'Vendas', valor: (c) => c.dados['2026T1'].vendas, tipo: 'numero' },
  { id: 'vendasHom', titulo: 'Vendas vs. 1.º T 25', valor: (c) => varHom(c, 'vendas'), tipo: 'pct' },
]

type Filtro = 'todos' | SubRegiao
const FILTROS: { id: Filtro; label: string }[] = [
  { id: 'todos', label: 'Distrito (19)' },
  { id: 'Região de Aveiro', label: 'Região de Aveiro' },
  { id: 'Área Metropolitana do Porto', label: 'AM Porto' },
]

function descarregarCsv() {
  const blob = new Blob(['\uFEFF' + paraCsv()], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ine-precos-habitacao-distrito-aveiro.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function TabelaConcelhos() {
  const [ordem, setOrdem] = useState<{ id: string; desc: boolean }>({ id: 'total', desc: true })
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const linhas = useMemo(() => {
    const col = COLUNAS.find((c) => c.id === ordem.id)!
    return CONCELHOS.filter((c) => filtro === 'todos' || c.subRegiao === filtro).sort((a, b) => {
      const va = col.valor(a)
      const vb = col.valor(b)
      if (va == null) return 1
      if (vb == null) return -1
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string, 'pt') : va - (vb as number)
      return ordem.desc ? -cmp : cmp
    })
  }, [ordem, filtro])

  const cont = CONTINENTE.dados

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup
          type="single"
          variant="outline"
          value={filtro}
          onValueChange={(v) => v && setFiltro(v as Filtro)}
          aria-label="Filtrar por sub-região"
          className="bg-card"
        >
          {FILTROS.map((f) => (
            <ToggleGroupItem key={f.id} value={f.id} className="px-3 text-xs">
              {f.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button variant="outline" size="sm" onClick={descarregarCsv}>
          <Download aria-hidden="true" />
          Descarregar CSV (3 períodos)
        </Button>
      </div>

      <div className="max-w-full overflow-hidden rounded-xl border bg-card">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              {COLUNAS.map((col) => {
                const ativa = ordem.id === col.id
                const Icone = !ativa ? ArrowUpDown : ordem.desc ? ArrowDown : ArrowUp
                return (
                  <TableHead
                    key={col.id}
                    className={cn(col.tipo !== 'texto' && 'text-right')}
                    aria-sort={ativa ? (ordem.desc ? 'descending' : 'ascending') : 'none'}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOrdem((o) => ({ id: col.id, desc: o.id === col.id ? !o.desc : col.tipo !== 'texto' }))
                      }
                      className={cn(
                        'inline-flex items-center gap-1 rounded-sm font-medium hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring',
                        ativa ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {col.titulo}
                      <Icone className="size-3.5" aria-hidden="true" />
                    </button>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {linhas.map((c) => (
              <TableRow key={c.codigo} className={cn(c.codigo === CODIGO_OVAR && 'bg-accent/25 hover:bg-accent/35')}>
                {COLUNAS.map((col) => {
                  const v = col.valor(c)
                  if (col.tipo === 'texto')
                    return (
                      <TableCell key={col.id} className="font-medium">
                        {v}
                      </TableCell>
                    )
                  return (
                    <TableCell key={col.id} className="text-right font-mono tabular-nums">
                      {col.tipo === 'pct' ? <Variacao valor={v as number | null} /> : fmtNum(v as number | null)}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
            <TableRow className="border-t-2 bg-muted/60 hover:bg-muted/60">
              <TableCell className="font-medium">Continente (referência)</TableCell>
              <TableCell className="text-right font-mono tabular-nums">{fmtNum(cont['2026T1'].total)}</TableCell>
              <TableCell className="text-right">
                <Variacao valor={variacao(cont['2026T1'].total, cont['2025T4'].total)} />
              </TableCell>
              <TableCell className="text-right">
                <Variacao valor={variacao(cont['2026T1'].total, cont['2025T1'].total)} />
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">{fmtNum(cont['2026T1'].novos)}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">{fmtNum(cont['2026T1'].existentes)}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">{fmtNum(cont['2026T1'].vendas)}</TableCell>
              <TableCell className="text-right">
                <Variacao valor={variacao(cont['2026T1'].vendas, cont['2025T1'].vendas)} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Valores do 1.º trimestre de 2026. Castelo de Paiva (Tâmega e Sousa) e Mealhada (Região de Coimbra) aparecem no
        filtro «Distrito». O CSV inclui os três períodos e a fonte.
      </p>
    </div>
  )
}
