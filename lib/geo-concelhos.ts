import { geoArea } from 'd3-geo'
import type { Feature, MultiPolygon, Polygon, Position } from 'geojson'

export type ConcelhoFeature = Feature<Polygon | MultiPolygon, { codigo: string }>

const API = 'https://json.geoapi.pt'
const TRINTA_DIAS = 60 * 60 * 24 * 30
const TOLERANCIA = 0.0004

const NOMES_API: Record<string, string> = {
  '0101': 'Águeda',
  '0102': 'Albergaria-a-velha',
  '0103': 'Anadia',
  '0104': 'Arouca',
  '0105': 'Aveiro',
  '0106': 'Castelo de Paiva',
  '0107': 'Espinho',
  '0108': 'Estarreja',
  '0109': 'Santa Maria da Feira',
  '0110': 'Ílhavo',
  '0111': 'Mealhada',
  '0112': 'Murtosa',
  '0113': 'Oliveira de Azeméis',
  '0114': 'Oliveira do Bairro',
  '0115': 'Ovar',
  '0116': 'São João da Madeira',
  '0117': 'Sever do Vouga',
  '0118': 'Vagos',
  '0119': 'Vale de Cambra',
}

function simplificarAnel(anel: Position[]): Position[] {
  const saida: Position[] = []
  let ultimo: Position | null = null
  for (const [x, y] of anel) {
    const p = [Math.round(x * 1e4) / 1e4, Math.round(y * 1e4) / 1e4]
    if (!ultimo || Math.abs(p[0] - ultimo[0]) > TOLERANCIA || Math.abs(p[1] - ultimo[1]) > TOLERANCIA) {
      saida.push(p)
      ultimo = p
    }
  }
  const [primeiro] = saida
  const fim = saida[saida.length - 1]
  if (primeiro && (primeiro[0] !== fim[0] || primeiro[1] !== fim[1])) saida.push(primeiro)
  return saida.length >= 4 ? saida : anel
}

// d3-geo uses spherical winding (clockwise exterior); GeoJSON from the API follows RFC 7946
// (counter-clockwise), which d3 would render as "the whole world minus the concelho".
function corrigirPoligono(aneis: Position[][]): Position[][] {
  const simplificado = aneis.map(simplificarAnel)
  const area = geoArea({ type: 'Polygon', coordinates: simplificado })
  return area > 2 * Math.PI ? simplificado.map((a) => [...a].reverse()) : simplificado
}

function paraFeature(codigo: string, geometria: Polygon | MultiPolygon): ConcelhoFeature {
  const geometry: Polygon | MultiPolygon =
    geometria.type === 'Polygon'
      ? { type: 'Polygon', coordinates: corrigirPoligono(geometria.coordinates) }
      : { type: 'MultiPolygon', coordinates: geometria.coordinates.map(corrigirPoligono) }
  return { type: 'Feature', properties: { codigo }, geometry }
}

export async function obterGeometriasConcelhos(): Promise<ConcelhoFeature[] | null> {
  try {
    return await Promise.all(
      Object.entries(NOMES_API).map(async ([codigo, nome]) => {
        const res = await fetch(`${API}/municipio/${encodeURIComponent(nome)}`, {
          headers: { Accept: 'application/json' },
          next: { revalidate: TRINTA_DIAS },
        })
        if (!res.ok) throw new Error(`geoapi.pt ${res.status} para ${nome}`)
        const json = await res.json()
        return paraFeature(codigo, json.geojson.geometry)
      }),
    )
  } catch (erro) {
    console.error('Falha ao obter limites dos concelhos:', erro)
    return null
  }
}
