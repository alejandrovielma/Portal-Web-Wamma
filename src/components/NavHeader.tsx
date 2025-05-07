import React from 'react';

export interface BreadcrumbItem {
  nombre: string;
  link: string;
}

/**
 * Función para generar un array de objetos BreadcrumbItem.
 * @param segments Un array de strings que representan los segmentos de la URL.
 * Por ejemplo: ['productos', 'electronica', 'detalle-123'].
 * @param baseUrl La URL base de tu sitio web (opcional, por defecto es '/').
 * @returns Un array de objetos BreadcrumbItem.
 */
export function generateBreadcrumbs(segments: string[], baseUrl: string = '/'): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ nombre: 'Inicio', link: baseUrl }];
  let currentPath = baseUrl;

  segments.forEach((segment) => {
    currentPath += (currentPath.endsWith('/') ? '' : '/') + segment;
    breadcrumbs.push({
      nombre: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '), // Formatear el nombre
      link: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Función alternativa que recibe un array de objetos con nombre y un slug/path.
 * Útil si tienes la información del nombre directamente.
 * @param items Un array de objetos con las propiedades 'nombre' y 'slug'.
 * @param baseUrl La URL base de tu sitio web (opcional, por defecto es '/').
 * @returns Un array de objetos BreadcrumbItem.
 */
export function generateBreadcrumbsFromItems(
  items: { nombre: string; slug: string }[],
  baseUrl: string = '/'
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ nombre: 'Inicio', link: baseUrl }];
  let currentPath = baseUrl;

  items.forEach((item) => {
    currentPath += (currentPath.endsWith('/') ? '' : '/') + item.slug;
    breadcrumbs.push({
      nombre: item.nombre,
      link: currentPath,
    });
  });

  return breadcrumbs;
}

interface HeaderProps {
  breadcrumbs: BreadcrumbItem[];
  titulo?: string; // Prop opcional para el título
}

export const NavHeader: React.FC<HeaderProps> = ({ breadcrumbs, titulo = "Título" }) => {
  return (
    <header className="bg-blue-500 text-white py-4 px-6 flex items-center justify-between">
      {/* Sección izquierda: Logo y texto */}
      <div className="flex items-center">
        <img src="logo-wamma.png" alt="Logo Awani" className="h-8 w-auto mr-4" /> {/* Ajusta el tamaño del logo */}
        <div>
          <h1 className="text-lg font-semibold">Wamma</h1>
          <p className="text-sm">Aprendices del agua</p>
        </div>
      </div>

      {/* Sección central: Título */}
      <h2 className="text-xl font-semibold">{titulo}</h2>

      {/* Sección derecha: "X" (puedes usar un icono o texto) */}
      <span className="text-2xl cursor-pointer">X</span>

      {/* (Opcional) Migas de pan - puedes posicionarlas donde prefieras */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="absolute bottom-2 left-6 text-sm">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <li key={index}>
                <a href={item.link} className="text-white hover:underline">
                  {item.nombre}
                </a>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-white">&gt;</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </header>
  );
};