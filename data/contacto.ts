export const CONTACTO = {
  nome: 'Pia Baeza',
  funcao: 'Consultora imobiliária · Distrito de Aveiro',
  telefone: '932 293 883',
  telefoneHref: 'tel:+351932293883',
  // Coloque a foto em /public/images/pia-baeza.jpg e troque null por '/images/pia-baeza.jpg'
  foto: '/images/pia_baeza.jpeg' as string | null,
}

export const ASSINATURA = `${CONTACTO.nome} · ${CONTACTO.telefone}`
