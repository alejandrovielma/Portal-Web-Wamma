import {
  BreadcrumbItem,
  generateBreadcrumbs,
  NavHeader,
} from "#components/NavHeader.tsx";
import PopInfo from "#components/PopInfo.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostIt from "#components/UnitPostIt.tsx";
import { useState } from "react";

export function Library() {
  // Estado para el manejo de la ventana emergente
  const [isPopOpen, setIsPopOpen] = useState(true);

  // Estado para el manejo del arrastre
  const [isDragging, setIsDragging] = useState(false);
  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  const pageTitle = "Inicio"; // Título de la página

  // Estructura de breadcrumbs original
  const libraryBreadcrumbs: BreadcrumbItem[] = [
    { nombre: "Biblioteca", link: "/biblioteca" },
  ];

  // Generación de breadcrumbs dinámicos
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const pathSegments = currentPath
    .split("/")
    .filter((segment) => segment !== "");
  const breadcrumbs: BreadcrumbItem[] = generateBreadcrumbs(pathSegments);

  return (
    <SelectPostItLayer isDragging={isDragging}>
      <NavHeader
        titulo={pageTitle}
        pathItems={libraryBreadcrumbs}
        breadcrumbs={breadcrumbs}
      />

      {/* Integración de PopInfo */}
      {isPopOpen && <PopInfo onClose={() => setIsPopOpen(false)} />}

      <div className="size-60">
        <UnitPostIt imageLink="images/homeBg.jpg" handleEvent={handleEvent} />
      </div>
    </SelectPostItLayer>
  );
}

export default Library;
