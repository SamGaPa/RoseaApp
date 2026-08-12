import { useState } from 'react';
import '../styles/recomendaciones.css';
import { obtenerRecomendaciones } from '../services/recommendationApi';

export default function Recomendaciones() {
  const [tipoPiel, setTipoPiel] = useState('');
  const [necesidades, setNecesidades] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const tiposPiel = ['Seca', 'Grasa', 'Mixta'];
  const listaNecesidades = ['Hidratacion', 'Limpieza', 'Control de acne'];

  const manejarTipoPiel = (e) => {
    setTipoPiel(e.target.value);
  };

  const manejarNecesidades = (e) => {
    const { value, checked } = e.target;
    setNecesidades((prev) =>
      checked ? [...prev, value] : prev.filter((n) => n !== value)
    );
  };

  const manejarBuscar = async () => {
    if (!tipoPiel || necesidades.length === 0) {
      setError('Por favor, selecciona un tipo de piel y al menos una necesidad.');
      return;
    }

    setCargando(true);
    setError(null);
    setRecomendaciones(null);

    try {
      const datos = { tipoPiel, necesidades };
      const resultado = await obtenerRecomendaciones(datos);
      setRecomendaciones(resultado);
    } catch (err) {
      setError('Error al obtener recomendaciones: ' + err.message);
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="recomendaciones-container">
      <header className="recomendaciones-header">
        <h1>Recomendaciones Rosea</h1>
        <p>Descubre los productos perfectos para tu piel</p>
      </header>

      <main className="recomendaciones-form">
        <section className="form-section">
          <h2>Tipo de Piel</h2>
          <div className="radio-group">
            {tiposPiel.map((tipo) => (
              <label key={tipo} className="radio-label">
                <input
                  type="radio"
                  name="tipoPiel"
                  value={tipo}
                  checked={tipoPiel === tipo}
                  onChange={manejarTipoPiel}
                />
                <span>{tipo}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="form-section">
          <h2>Que necesitas?</h2>
          <div className="checkbox-group">
            {listaNecesidades.map((necesidad) => (
              <label key={necesidad} className="checkbox-label">
                <input
                  type="checkbox"
                  value={necesidad}
                  checked={necesidades.includes(necesidad)}
                  onChange={manejarNecesidades}
                />
                <span>{necesidad}</span>
              </label>
            ))}
          </div>
        </section>

        <button className="btn-buscar" onClick={manejarBuscar} disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar Recomendaciones'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </main>

      {recomendaciones && (
        <section className="recomendaciones-resultados">
          <h2>Productos Recomendados</h2>
          {recomendaciones.length > 0 ? (
            <div className="productos-grid">
              {recomendaciones.map((producto) => (
                <div key={producto.id} className="producto-card">
                  {producto.imagen && (
                    <img
                      src={`data:image/png;base64,${producto.imagen}`}
                      alt={producto.nombre}
                      className="producto-imagen"
                    />
                  )}
                  <h3>{producto.nombre}</h3>
                  <p className="producto-descripcion">{producto.descripcion}</p>
                  <p className="producto-precio">${producto.precio.toFixed(2)}</p>
                  <button className="btn-agregar">Agregar al Carrito</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="sin-resultados">No se encontraron productos para tu seleccion.</p>
          )}
        </section>
      )}
    </div>
  );
}
