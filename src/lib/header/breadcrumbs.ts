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