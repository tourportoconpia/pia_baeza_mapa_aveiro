const NOTAS = [
  {
    titulo: 'Preço de venda efetivo',
    texto:
      'São valores de vendas realmente concretizadas, com base nas transações registadas, e não preços pedidos em anúncios. Os preços de anúncio costumam ser mais altos.',
  },
  {
    titulo: 'Mediana dos últimos 12 meses',
    texto:
      'Cada trimestre é uma janela rolante de 12 meses, não só os três meses do trimestre. O 1.º T 2026 cobre abril de 2025 a março de 2026; o 4.º T 2025 cobre janeiro a dezembro de 2025.',
  },
  {
    titulo: 'Como ler as comparações',
    texto:
      'O 1.º T 2026 é comparado com o 4.º T 2025 (trimestre anterior) e com o 1.º T 2025 (mesmo período um ano antes). Como as janelas do trimestre anterior se sobrepõem em 9 meses, a variação trimestral é naturalmente mais suave.',
  },
  {
    titulo: 'Mediana, não média',
    texto:
      'Metade das vendas foi feita abaixo deste valor e metade acima. As medianas de vários concelhos não se podem somar nem calcular a média entre si.',
  },
  {
    titulo: 'Valores em falta («—»)',
    texto:
      'O INE não publica o valor quando há poucas vendas num segmento (acontece sobretudo nas casas novas em concelhos pequenos).',
  },
  {
    titulo: 'Nível geográfico',
    texto:
      'A desagregação por freguesia só existe para municípios da AM Porto, Grande Lisboa, Península de Setúbal, Algarve e municípios com mais de 100 mil habitantes (Censos 2021). Aqui mostram-se os 19 concelhos do distrito de Aveiro.',
  },
]

export function NotasMetodologia() {
  return (
    <dl className="grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
      {NOTAS.map((n) => (
        <div key={n.titulo} className="flex flex-col gap-1.5">
          <dt className="font-semibold">{n.titulo}</dt>
          <dd className="text-sm leading-relaxed text-muted-foreground text-pretty">{n.texto}</dd>
        </div>
      ))}
    </dl>
  )
}
