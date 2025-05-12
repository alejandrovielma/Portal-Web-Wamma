import {
  BreadcrumbItem,
  generateBreadcrumbs,
  NavHeader,
} from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostIt from "#components/UnitPostIt.tsx";
import { useState } from "react";

export function Library() {
  const [isDragging, setIsDragging] = useState(false);
  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  const pageTitle = "Inicio"; // Título de la página

  // Se conserva la estructura de breadcrumbs original
  const libraryBreadcrumbs: BreadcrumbItem[] = [
    { nombre: "Biblioteca", link: "/biblioteca" },
    // En caso de tener más niveles
    // { nombre: "Categoría", link: "/biblioteca/categoria" },
    // { nombre: "Detalle", link: "/biblioteca/categoria/detalle" },
  ];

  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const pathSegments = currentPath
    .split("/")
    .filter((segment) => segment !== "");
  const breadcrumbs: BreadcrumbItem[] = generateBreadcrumbs(pathSegments); // Genera dinámicamente

  return (
    <SelectPostItLayer isDragging={isDragging}>
      <NavHeader
        titulo={pageTitle}
        pathItems={libraryBreadcrumbs}
        breadcrumbs={breadcrumbs}
      />
      <div className="size-60">
        <UnitPostIt imageLink="images/homeBg.jpg" handleEvent={handleEvent} />
      </div>
    </SelectPostItLayer>
  );
}

export default Library;
