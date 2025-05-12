import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '#pages/home/Home.tsx'
import Map from '#pages/map/Map.tsx'
import Animals from '#pages/animals/Animals.tsx'
import News from '#pages/news/News.tsx'
import Library from '#pages/library/Library.tsx'
import './globals.css'
import { GridStackGlobalWidgetProvider } from '#lib/gridStackLib/grip-stack-global-widget-provider.tsx'
import ArticlesSearch from '#pages/library/ArticlesSearch.tsx'

const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/mapa', element: <Map />},
  {path: '/animales', element: <Animals />},
  {path: '/actualidad', element: <News />},
  {path: '/biblioteca', element: <Library />},
  {path: '/articulos', element: <ArticlesSearch />},
]
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GridStackGlobalWidgetProvider>
      <RouterProvider router={router}/>
    </GridStackGlobalWidgetProvider>
  </StrictMode>,
)
