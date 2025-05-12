import React from "react";
import { TransitionToMenuButton } from "./TransitionToMenuButton";

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
export function generateBreadcrumbs(
  segments: string[],
  baseUrl: string = "/"
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ nombre: "Inicio", link: baseUrl }];
  let currentPath = baseUrl;

  segments.forEach((segment) => {
    currentPath += (currentPath.endsWith("/") ? "" : "/") + segment;
    breadcrumbs.push({
      nombre:
        segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " "), // Formatear el nombre
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
  baseUrl: string = "/"
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ nombre: "Inicio", link: baseUrl }];
  let currentPath = baseUrl;

  items.forEach((item) => {
    currentPath += (currentPath.endsWith("/") ? "" : "/") + item.slug;
    breadcrumbs.push({
      nombre: item.nombre,
      link: currentPath,
    });
  });

  return breadcrumbs;
}

interface HeaderProps {
  pathItems?: BreadcrumbItem[];
  titulo?: string;
}

export const NavHeader: React.FC<HeaderProps> = ({ pathItems, titulo }) => {
  const fullBreadcrumbs: BreadcrumbItem[] = [];
  if (titulo) {
    fullBreadcrumbs.push({ nombre: titulo, link: "/" });
  } else {
    fullBreadcrumbs.push({ nombre: "Inicio", link: "/" });
  }

  if (pathItems && pathItems.length > 0) {
    fullBreadcrumbs.push(...pathItems);
  }

  return (
    <header className="bg-blue-500 text-white flex items-stretch justify-between relative h-20">
      <TransitionToMenuButton
        href="/"
        className="flex items-center pl-6 cursor-pointer"
      >
        <img src="logo.svg" alt="Logo Awani" className="h-8 w-auto mr-4" />
        <div>
          <h1 className="text-lg font-semibold text-start">Wamma</h1>
          <p className="text-sm">Aprendices del agua</p>
        </div>
      </TransitionToMenuButton>
      <div className="border-l border-white self-stretch mx-4"></div>
      {/* Now using 'fullBreadcrumbs' for rendering */}
      {fullBreadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="flex items-center text-xl">
          {fullBreadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <a href={item.link} className="text-white hover:underline">
                {item.nombre}
              </a>
              {index < fullBreadcrumbs.length - 1 && (
                <span className="mx-2 text-white">&gt;</span>
              )}{" "}
            </React.Fragment>
          ))}
        </nav>
      )}
      <TransitionToMenuButton
        href="/"
        className="text-2xl cursor-pointer ml-auto pr-6 flex items-center"
      >
        <img src="x.svg" alt="salir" className="h-8 w-auto mr-4" />
      </TransitionToMenuButton>
    </header>
  );
};
