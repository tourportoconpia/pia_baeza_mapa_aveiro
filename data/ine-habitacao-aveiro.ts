/**
 * Dados INE — Estatísticas de Preços da Habitação ao Nível Local (Metodologia 2022).
 * Para atualizar: acrescente/substitua os valores em `CONCELHOS` e `CONTINENTE`.
 * `null` corresponde a "-" na tabela do INE (sem valor publicado).
 */

export type PeriodoId = '2026T1' | '2025T4' | '2025T1'

export type Periodo = {
  id: PeriodoId
  label: string
  curto: string
  papel: string
}

export const PERIODOS: Periodo[] = [
  { id: '2026T1', label: '1.º Trimestre de 2026', curto: '1.º T 2026', papel: 'Período atual' },
  { id: '2025T4', label: '4.º Trimestre de 2025', curto: '4.º T 2025', papel: 'Trimestre anterior' },
  { id: '2025T1', label: '1.º Trimestre de 2025', curto: '1.º T 2025', papel: 'Mesmo período, 1 ano antes' },
]

export const PERIODO_ATUAL: PeriodoId = '2026T1'
export const PERIODO_ANTERIOR: PeriodoId = '2025T4'
export const PERIODO_HOMOLOGO: PeriodoId = '2025T1'

export type Registo = {
  total: number
  novos: number | null
  existentes: number
  vendas: number
}

export type SubRegiao = 'Região de Aveiro' | 'Área Metropolitana do Porto' | 'Tâmega e Sousa' | 'Região de Coimbra'

export type Concelho = {
  codigo: string
  nome: string
  subRegiao: SubRegiao
  dados: Record<PeriodoId, Registo>
}

const r = (total: number, novos: number | null, existentes: number, vendas: number): Registo => ({
  total,
  novos,
  existentes,
  vendas,
})

export const CONTINENTE: { nome: string; dados: Record<PeriodoId, Registo> } = {
  nome: 'Continente',
  dados: {
    '2026T1': r(2175, 2402, 2118, 155064),
    '2025T4': r(2083, 2324, 2022, 159002),
    '2025T1': r(1846, 2181, 1770, 153252),
  },
}

/** Valor de referência indicado para a NUTS III Região de Aveiro (1.º T 2026). */
export const REGIAO_AVEIRO_REFERENCIA = {
  nome: 'Região de Aveiro (NUTS III)',
  periodo: '2026T1' as PeriodoId,
  total: 1627,
}

export const CONCELHOS: Concelho[] = [
  {
    codigo: '0104',
    nome: 'Arouca',
    subRegiao: 'Área Metropolitana do Porto',
    dados: { '2026T1': r(1012, null, 947, 132), '2025T4': r(1057, null, 967, 142), '2025T1': r(1055, 1486, 759, 150) },
  },
  {
    codigo: '0107',
    nome: 'Espinho',
    subRegiao: 'Área Metropolitana do Porto',
    dados: { '2026T1': r(2776, 3148, 2434, 454), '2025T4': r(2703, 3088, 2333, 466), '2025T1': r(2460, 2600, 2367, 503) },
  },
  {
    codigo: '0113',
    nome: 'Oliveira de Azeméis',
    subRegiao: 'Área Metropolitana do Porto',
    dados: { '2026T1': r(1412, 1453, 1401, 805), '2025T4': r(1333, 1431, 1302, 853), '2025T1': r(1169, 1270, 1122, 770) },
  },
  {
    codigo: '0109',
    nome: 'Santa Maria da Feira',
    subRegiao: 'Área Metropolitana do Porto',
    dados: { '2026T1': r(1700, 1777, 1667, 1508), '2025T4': r(1636, 1740, 1606, 1545), '2025T1': r(1403, 1576, 1379, 1331) },
  },
  {
    codigo: '0116',
    nome: 'São João da Madeira',
    subRegiao: 'Área Metropolitana do Porto',
    dados: { '2026T1': r(1836, 2094, 1616, 398), '2025T4': r(1678, 2049, 1535, 353), '2025T1': r(1400, 1734, 1287, 285) },
  },
  {
    codigo: '0119',
    nome: 'Vale de Cambra',
    subRegiao: 'Área Metropolitana do Porto',
    dados: { '2026T1': r(1318, null, 1364, 144), '2025T4': r(1250, null, 1250, 144), '2025T1': r(1110, null, 1101, 122) },
  },
  {
    codigo: '0106',
    nome: 'Castelo de Paiva',
    subRegiao: 'Tâmega e Sousa',
    dados: { '2026T1': r(952, null, 995, 125), '2025T4': r(962, null, 936, 127), '2025T1': r(987, 1308, 702, 127) },
  },
  {
    codigo: '0101',
    nome: 'Águeda',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(1366, 1402, 1353, 574), '2025T4': r(1250, 1224, 1251, 576), '2025T1': r(1003, 1114, 994, 503) },
  },
  {
    codigo: '0102',
    nome: 'Albergaria-a-Velha',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(1357, null, 1352, 282), '2025T4': r(1322, 1350, 1313, 295), '2025T1': r(1194, 1146, 1219, 279) },
  },
  {
    codigo: '0103',
    nome: 'Anadia',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(941, 1446, 863, 420), '2025T4': r(856, 1224, 812, 402), '2025T1': r(790, null, 783, 326) },
  },
  {
    codigo: '0105',
    nome: 'Aveiro',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(2329, 3086, 2045, 1108), '2025T4': r(2343, 3118, 1987, 1250), '2025T1': r(2222, 2968, 1814, 1241) },
  },
  {
    codigo: '0108',
    nome: 'Estarreja',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(1248, 1187, 1288, 276), '2025T4': r(1296, 1345, 1287, 280), '2025T1': r(1148, 1496, 1046, 230) },
  },
  {
    codigo: '0110',
    nome: 'Ílhavo',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(2248, 2676, 2024, 660), '2025T4': r(2188, 2731, 1984, 683), '2025T1': r(1798, 2189, 1699, 605) },
  },
  {
    codigo: '0112',
    nome: 'Murtosa',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(1406, 1626, 1374, 192), '2025T4': r(1355, 1659, 1316, 203), '2025T1': r(1143, null, 1109, 220) },
  },
  {
    codigo: '0114',
    nome: 'Oliveira do Bairro',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(1358, 1545, 1340, 304), '2025T4': r(1337, 1343, 1330, 333), '2025T1': r(1200, 1291, 1191, 293) },
  },
  {
    codigo: '0115',
    nome: 'Ovar',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(1836, 1851, 1828, 768), '2025T4': r(1713, 1832, 1696, 787), '2025T1': r(1562, 1881, 1501, 770) },
  },
  {
    codigo: '0117',
    nome: 'Sever do Vouga',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(786, null, 750, 152), '2025T4': r(769, null, 688, 145), '2025T1': r(740, null, 695, 122) },
  },
  {
    codigo: '0118',
    nome: 'Vagos',
    subRegiao: 'Região de Aveiro',
    dados: { '2026T1': r(1715, 2252, 1629, 209), '2025T4': r(1684, 2201, 1567, 231), '2025T1': r(1532, 1942, 1376, 263) },
  },
  {
    codigo: '0111',
    nome: 'Mealhada',
    subRegiao: 'Região de Coimbra',
    dados: { '2026T1': r(1132, 1416, 1038, 234), '2025T4': r(1133, 1434, 1047, 252), '2025T1': r(977, null, 946, 221) },
  },
]

export const CODIGO_OVAR = '0115'

/** Concelhos que fazem fronteira com Ovar (terrestre ou pela ria). */
export const VIZINHOS_OVAR = ['0107', '0109', '0113', '0108', '0112', '0116']

export const FONTE =
  'Fonte: INE, Estatísticas de Preços da Habitação ao Nível Local (Metodologia 2022), atualizado a 17/07/2026'

export const DEFINICAO = 'Valor mediano das vendas de alojamentos familiares nos últimos 12 meses'
