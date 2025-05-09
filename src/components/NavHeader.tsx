import React from "react";

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
  breadcrumbs: BreadcrumbItem[]; // Este prop es crucial ahora para mostrar la ruta
  titulo?: string; // Este prop ya no se usará para el encabezado central
}

export const NavHeader: React.FC<HeaderProps> = ({
  breadcrumbs, // Usaremos este prop aquí
}) => {
  return (
    // Header: Contenedor flex principal. Elimina padding. Añade altura fija (h-20).
    // Mantiene items-stretch (para estirar hijos), justify-between (con ml-auto en la X), relative.
    <header className="bg-blue-500 text-white flex items-stretch justify-between relative h-20">
      {" "}
      {/* Altura fija h-20 */}
      {/* Sección Logo y texto - Hijo directo del header con padding izquierdo */}
      <div className="flex items-center pl-6">
        {" "}
        {/* pl-6 para el espacio del borde izquierdo */}
        <img src="logo.svg" alt="Logo Awani" className="h-8 w-auto mr-4" />
        <div>
          <h1 className="text-lg font-semibold">Wamma</h1>
          <p className="text-sm">Aprendices del agua</p>
        </div>
      </div>
      {/* Línea divisoria vertical - Hijo directo del header */}
      {/* self-stretch: para que se estire a la altura fija del header (h-20) */}
      {/* mx-4: para el espacio horizontal */}
      <div className="border-l border-white self-stretch mx-4"></div>
      {/* --- ¡MIGAS DE PAN EN LA POSICIÓN DONDE ESTABA EL TÍTULO! --- */}
      {/* Contenedor flex para los enlaces de breadcrumbs, es un hijo directo del header */}
      {/* Condicionalmente renderizamos si hay breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="flex items-center text-xl">
          {" "}
          {/* nav para semántica, flex items-center para alinear, text-sm para tamaño */}
          {breadcrumbs.map((item, index) => (
            // ... dentro del breadcrumbs.map ...
            <React.Fragment key={index}>
              <a href={item.link} className="text-white hover:underline">
                {item.nombre}
              </a>
              {/* Condición para mostrar el separador '>' solo si no es el último elemento */}
              {index < breadcrumbs.length - 1 && ( // <-- Aquí abre la condición
                <span className="mx-2 text-white">
                  &gt;
                </span> /* Separador con margen horizontal */
              )}{" "}
              {/* <-- Aquí cierra la condición con UN solo paréntesis antes de la llave '}' */}
            </React.Fragment>
            // ... resto del código ...
          ))}
        </nav>
      )}
      {/* --- Eliminado: <h2 className="text-xl font-semibold">{titulo}</h2> --- */}
      {/* Sección derecha: X/Imagen - Último hijo directo del header con padding derecho y ml-auto */}
      {/* ml-auto: Empuja a la derecha. PR-6 para el espacio del borde derecho. */}
      <a
        href="."
        className="text-2xl cursor-pointer ml-auto pr-6 flex items-center"
      >
        {" "}
        {/* ml-auto & pr-6 */}
        <img src="x.svg" alt="salir" className="h-8 w-auto mr-4" />
      </a>
      {/* --- Eliminado: Bloque de migas de pan con posicionamiento absoluto --- */}
      {/* Se elimina todo el bloque <nav aria-label="breadcrumb" className="absolute bottom-2 left-6 text-sm"> ... </nav> */}
    </header>
  );
};
