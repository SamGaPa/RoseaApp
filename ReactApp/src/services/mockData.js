// Mock data for testing without Express backend
export const mockRecommendations = [
  {
    id: 1,
    nombre: 'Crema Hidratante Premium',
    descripcion:
      'Crema enriquecida con ácido hialurónico y aloe vera. Ideal para pieles secas que necesitan hidratación intensiva.',
    precio: 49.99,
    imagen: null,
    categoria: 'Cremas',
  },
  {
    id: 2,
    nombre: 'Gel Limpiador Suave',
    descripcion:
      'Gel limpiador con extracto de manzanilla y té verde. Elimina impurezas sin resecar la piel.',
    precio: 24.99,
    imagen: null,
    categoria: 'Limpiezas',
  },
  {
    id: 3,
    nombre: 'Serum Antiacné',
    descripcion:
      'Serum con salicílico y niacinamida. Controla el acné y reduce poros dilatados.',
    precio: 39.99,
    imagen: null,
    categoria: 'Serums',
  },
  {
    id: 4,
    nombre: 'Mascarilla Purificante',
    descripcion:
      'Mascarilla de arcilla con carbón activado. Ideal para pieles grasas.',
    precio: 29.99,
    imagen: null,
    categoria: 'Mascarillas',
  },
  {
    id: 5,
    nombre: 'Tónico Balanceador',
    descripcion:
      'Tónico con pH balanceado. Prepara la piel para recibir otros productos.',
    precio: 19.99,
    imagen: null,
    categoria: 'Tónicos',
  },
  {
    id: 6,
    nombre: 'Protector Solar SPF 50',
    descripcion:
      'Protector solar de amplio espectro. Protege la piel de rayos UV A y B.',
    precio: 34.99,
    imagen: null,
    categoria: 'Protección',
  },
];

// Simulated API delay
export const simulateApiCall = (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock obtenerRecomendaciones function
export const mockObtenerRecomendaciones = async (datos) => {
  await simulateApiCall(1500);

  // Filter based on skin type and needs
  const { tipoPiel, necesidades } = datos;
  console.log('Mock API Called with:', { tipoPiel, necesidades });

  // Simple logic for mock recommendations
  let recomendaciones = mockRecommendations;

  if (tipoPiel === 'Seca') {
    recomendaciones = recomendaciones.filter((p) =>
      ['Cremas', 'Serums', 'Tónicos'].includes(p.categoria)
    );
  } else if (tipoPiel === 'Grasa') {
    recomendaciones = recomendaciones.filter((p) =>
      ['Mascarillas', 'Geles', 'Limpiezas'].includes(p.categoria)
    );
  } else if (tipoPiel === 'Mixta') {
    recomendaciones = recomendaciones.filter((p) =>
      ['Serums', 'Tónicos', 'Limpiezas'].includes(p.categoria)
    );
  }

  // If needs include specific keywords, filter
  if (necesidades.includes('Hidratación')) {
    recomendaciones = recomendaciones.filter((p) =>
      p.nombre.toLowerCase().includes('hidratan')
    );
  }

  if (necesidades.includes('Limpieza')) {
    recomendaciones = recomendaciones.filter((p) =>
      ['Limpiezas', 'Mascarillas'].includes(p.categoria)
    );
  }

  if (necesidades.includes('Control de acné')) {
    recomendaciones = recomendaciones.filter((p) =>
      p.nombre.toLowerCase().includes('acné') ||
      p.descripcion.toLowerCase().includes('acné')
    );
  }

  return recomendaciones.length > 0
    ? recomendaciones
    : mockRecommendations.slice(0, 3);
};
