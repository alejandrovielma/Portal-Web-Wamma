# Wamma — Aprendices del agua

Sitio educativo sobre la cultura del agua en la región Guayana (Venezuela): mapa interactivo de destinos, un catálogo de fauna acuática, artículos y recursos sobre el tema, todo organizado como notas adhesivas ("postits") que se pueden arrastrar y armar libremente en la página de Inicio.

🔗 **Demo en vivo**: [portal-web-wamma.vercel.app](https://portal-web-wamma.vercel.app)

Proyecto desarrollado por un equipo de estudiantes de Ingeniería en Informática de la UCAB Guayana.

## Funcionalidades

- **Inicio interactivo**: los contenidos del sitio (destinos, animales, artículos, libros) se pueden arrastrar como postits sobre una grilla libre ([GridStack](https://gridstackjs.com/)), redimensionar y reorganizar; el arreglo queda guardado en el navegador.
- **Mapa** (`/mapa`): 6 destinos curados de la región Guayana con reseña, imágenes y video, más un buscador en vivo de cualquier lugar de Venezuela (OpenStreetMap/Nominatim) que trae datos reales (categoría, fecha de fundación, operador, etc.) y arma el mismo panel que los destinos curados.
- **Acuario** (`/animales`): catálogo de 30 especies de fauna acuática y de humedal de la región, filtrable por clase, más un buscador en vivo de cualquier especie (GBIF + iNaturalist + Wikipedia) que descarta automáticamente animales no acuáticos.
- **Biblioteca** (`/biblioteca` y `/articulos`): artículos y recursos propios del sitio, más buscadores en vivo de libros reales (Open Library) y de artículos de actualidad relacionados con Venezuela y el agua (Currents API, vía un proxy propio para no exponer la clave).
- Todos los resultados de las búsquedas en vivo (lugares, animales, libros, artículos) se muestran como los mismos postits arrastrables del resto del sitio, con un enlace a la fuente original.

## Stack técnico

- **Frontend**: React 19 + TypeScript + Vite, [React Router](https://reactrouter.com/) (SPA), Tailwind CSS v4
- **Interfaz de postits**: [GridStack.js](https://gridstackjs.com/) con un wrapper propio en React
- **Mapa**: [react-leaflet](https://react-leaflet.js.org/) + OpenStreetMap
- **Animaciones**: Framer Motion, GSAP
- **Backend**: funciones serverless de Vercel (carpeta `api/`) para las integraciones que necesitan una clave privada
- **APIs externas**: GBIF, iNaturalist, Wikipedia, Nominatim (OpenStreetMap), Open Library, Currents API, WeatherAPI — todas públicas y de solo lectura

## Cómo correrlo localmente

Requiere [Bun](https://bun.sh/).

```bash
bun install
bun run dev
```

Esto levanta el sitio en `http://localhost:5173`, pero **las funciones de `api/` no corren con `vite` solo** (necesitan el runtime de Vercel). Para probarlas localmente:

```bash
npm i -g vercel
vercel dev
```

### Variables de entorno

Crea un `.env` en la raíz (ver `.env.example`) con:

```
WEATHER_API_KEY=tu_key_de_weatherapi.com
CURRENTS_API_KEY=tu_key_de_currentsapi.services
```

Ninguna de las dos lleva el prefijo `VITE_` a propósito: así Vite nunca las empaqueta en el bundle del cliente — solo las usan las funciones serverless en `api/`, del lado del servidor.

## Estructura del proyecto

```
api/            Funciones serverless (proxies a WeatherAPI y Currents API)
info/           Datos curados del sitio (destinos, fauna, artículos, recursos)
src/
  components/   Componentes de UI, incluyendo los postits (PostIts/)
  lib/          Lógica de datos: GridStack, búsquedas en vivo por API
  pages/        Una carpeta por ruta (home, map, animals, library, news, articlesSearch)
  data/         Acceso a los datos curados (repository.ts) y scripts de scraping
```

## Despliegue

Desplegado en [Vercel](https://vercel.com/), con auto-deploy en cada push a `main`. Las variables de entorno se configuran en el dashboard del proyecto (Project Settings → Environment Variables), no en el repositorio.
