import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '#page/home/Home.tsx'
import Map from '#page/map/Map.tsx'
import Animals from '#page/animals/Animals.tsx'
import News from '#page/news/News.tsx'
import Library from '#page/library/Library.tsx'
import './index.css'

const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/mapa', element: <Map />},
  {path: '/animales', element: <Animals />},
  {path: '/novedades', element: <News />},
  {path: '/biblioteca', element: <Library />},
]
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
