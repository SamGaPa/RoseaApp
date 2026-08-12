# 📱 React App - Recomendaciones Rosea

## ✅ Estado Actual

El proyecto React con Vite está **completamente configurado y funcionando** en modo desarrollo.

### 📍 URL Local
- **React Dev Server:** http://localhost:5173/

## 🏗️ Estructura del Proyecto

```
ReactApp/
├── src/
│   ├── components/           # Componentes reutilizables
│   ├── pages/
│   │   └── Recomendaciones.jsx    # Página principal de recomendaciones
│   ├── services/
│   │   └── recommendationApi.js   # API fetch calls
│   ├── styles/
│   │   └── recomendaciones.css    # Estilos CSS
│   ├── assets/               # Imágenes y recursos
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos globales
├── public/                  # Archivos estáticos
├── .env                     # Variables de entorno (local)
├── .env.example             # Template de variables de entorno
├── vite.config.js           # Configuración de Vite
├── package.json
└── index.html              # HTML principal
```

## 🎨 Características Implementadas

### Página Recomendaciones.jsx
✅ **Selector de Tipo de Piel:**
- Radio buttons: Seca, Grasa, Mixta

✅ **Selector de Necesidades:**
- Checkboxes: Hidratación, Limpieza, Control de acné

✅ **Botón Buscar:**
- Valida selecciones
- Muestra estado de carga
- Maneja errores

✅ **Llamadas API:**
- Fetch a Express backend
- Método: POST /api/v1/recommendations
- Envía: { tipoPiel, necesidades }
- Recibe: Array de productos recomendados

✅ **Estilos Responsivos:**
- Grid layout para productos
- Mobile-first design
- Animaciones suaves
- Tema Rosea (colores rosa/marrón)

## 🔧 Variables de Entorno

### .env.example
```
VITE_API_URL=http://localhost:3001/api
```

### .env (Local Development)
```
VITE_API_URL=http://localhost:3001/api
```

**Nota:** El archivo `.env` NO debe ser commiteado a Git.

## 📦 Dependencias

```json
{
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.3",
    "vite": "^8.1.1"
  }
}
```

## 🚀 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint del código
npm run lint
```

## 📡 Servicio de API

**Archivo:** `src/services/recommendationApi.js`

### Función principal
```javascript
obtenerRecomendaciones(datos)
```

**Parámetros:**
```javascript
{
  tipoPiel: 'Seca' | 'Grasa' | 'Mixta',
  necesidades: ['Hidratación', 'Limpieza', 'Control de acné']
}
```

**Respuesta Esperada:**
```javascript
[
  {
    id: 1,
    nombre: 'Crema Hidratante',
    descripcion: '...',
    precio: 49.99,
    imagen: 'base64string...'
  },
  // ... más productos
]
```

## 🎯 Estados de la Página

1. **Inicial:** Mostrar selectores vacíos
2. **Validación:** Usuario debe seleccionar opciones
3. **Cargando:** Button deshabilitado, texto "Buscando..."
4. **Éxito:** Grid de productos con información
5. **Error:** Mensaje rojo con descripción del error
6. **Sin resultados:** Mensaje informativo

## 🔌 Integración con Express Backend

El servicio `recommendationApi.js` está configurado para conectar con:

**URL Base:** `http://localhost:3001/api`  
**Endpoint:** `POST /v1/recommendations`

Las variables de entorno son manejadas con `import.meta.env.VITE_*`

## 📱 Responsive Design

- **Desktop:** Grid 3-4 columnas
- **Tablet:** Grid 2-3 columnas
- **Mobile:** 1 columna

## 🎨 Paleta de Colores

- **Principal:** #e88d8d (Rosa Rosea)
- **Secundario:** #d97777 (Rosa oscuro)
- **Fondo:** #fdf8f5 (Beige claro)
- **Texto:** #333 (Gris oscuro)

## ❌ Limitaciones Actuales

1. **Sin Express Backend:** El API no está implementado aún
   - Las llamadas fallarán si no existe `http://localhost:3001/api`

2. **Mock Data (Opcional):** Puedes usar browser DevTools para simular respuestas

## ✅ Próximos Pasos (Fase 2)

1. Crear Express backend en `../RecommendationEngine/`
2. Implementar endpoint `POST /api/v1/recommendations`
3. Conectar a MySQL `roseadb`
4. Testear con Postman/React
5. Integrar con proyecto MVC
6. Build para producción

## 🛠️ Troubleshooting

### "GET http://localhost:3001 net::ERR_CONNECTION_REFUSED"
- Express backend no está ejecutándose
- Verifica que Express escuche en puerto 3001

### Estilos no se cargan
- Verifica que `recomendaciones.css` esté en `src/styles/`
- Reload del navegador (Ctrl+Shift+R)

### Variables de entorno no se cargan
- Reinicia el servidor Vite después de cambiar `.env`
- Usa `import.meta.env` (no `process.env`)

## 📚 Referencias

- [Vite Docs](https://vite.dev/)
- [React Docs](https://react.dev/)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
