import { FONTE } from '@/data/ine-habitacao-aveiro'
import { obterGeometriasConcelhos } from '@/lib/geo-concelhos'
import { Abertura, Cabecalho } from '@/components/habitacao/cabecalho'
import { Seccao } from '@/components/habitacao/seccao'
import { MapaExplorador } from '@/components/habitacao/mapa-explorador'
import { OvarDestaque } from '@/components/habitacao/ovar-destaque'
import { SinaisMercado } from '@/components/habitacao/sinais-mercado'
import { TabelaConcelhos } from '@/components/habitacao/tabela-concelhos'
import { NotasMetodologia } from '@/components/habitacao/notas-metodologia'
import { SeccaoContacto } from '@/components/habitacao/contacto'
import { CONTACTO } from '@/data/contacto'

export default async function Page() {
  const geometrias = await obterGeometriasConcelhos()

  return (
    <>
      <Cabecalho />
      <main>
        <Abertura />

        <Seccao
          id="mapa"
          etiqueta="Mapa interativo"
          titulo="Explore os 19 concelhos"
          descricao="Escolha o indicador e o período. Clique num concelho para ver os três trimestres lado a lado e copiar um resumo pronto a partilhar."
          className="bg-muted/40"
        >
          <MapaExplorador features={geometrias} />
        </Seccao>

        <Seccao
          id="ovar"
          etiqueta="Em destaque"
          titulo="Ovar: preços a subir, puxados pelas casas existentes"
          descricao="Indicadores do 1.º trimestre de 2026, comparados com o 4.º trimestre de 2025 e com o 1.º trimestre de 2025."
        >
          <OvarDestaque />
        </Seccao>

        <Seccao
          id="sinais"
          etiqueta="Para angariação e novas leads"
          titulo="Onde o mercado está a mexer"
          className="bg-muted/40"
        >
          <SinaisMercado />
        </Seccao>

        <Seccao
          id="tabela"
          etiqueta="Todos os dados"
          titulo="Tabela comparativa"
          descricao="Clique no título de uma coluna para ordenar."
        >
          <TabelaConcelhos />
        </Seccao>

        <Seccao id="notas" etiqueta="Metodologia" titulo="Como ler estes dados" className="bg-muted/40">
          <NotasMetodologia />
        </Seccao>

        <SeccaoContacto />
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">
            {CONTACTO.nome} ·{' '}
            <a href={CONTACTO.telefoneHref} className="underline underline-offset-4 hover:text-primary">
              {CONTACTO.telefone}
            </a>
          </p>
          <p>{FONTE}.</p>
          <p>Limites dos concelhos: Carta Administrativa Oficial de Portugal (DGT), via geoapi.pt.</p>
        </div>
      </footer>
    </>
  )
}
