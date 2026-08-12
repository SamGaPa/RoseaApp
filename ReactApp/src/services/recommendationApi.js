// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const obtenerRecomendaciones = async (datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/productos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching productos:', error);
    throw error;
  }
};
