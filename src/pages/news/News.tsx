import { NavHeader } from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
// Asegúrate que la ruta de importación y el tipo de exportación (default vs named) sean correctos
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";
import { useState } from "react";
// Asegúrate que la ruta a tu repositorio de data sea correcta
import { getLastProjects, Project } from "../../data/dataBase/repository";

export function News() {
  const [isDragging, setIsDragging] = useState(false);

  // Función para actualizar el estado de arrastre
  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  return (
    <>
      {/* Capa que posiblemente cubre la pantalla para manejar eventos de arrastre */}
      <SelectPostItLayer isDragging={isDragging}>
        {/* Encabezado de navegación */}
        <NavHeader
          pathItems={[{ nombre: "Actualidad", link: "/actualidad" }]}
        />

        {/* Contenedor principal del contenido */}
        <div className="flex flex-col items-center pt-32">
          <div className="flex flex-col items-center w-full gap-8">
            {/* Sección para el título - mantiene el max-width y padding */}
            <section className="w-full flex flex-col gap-4 max-w-6xl px-4">
              <h2 className="text-2xl">Últimos Proyectos</h2>
            </section>

            {/*
              Componente LastProjects - movido fuera de la sección
              para que su clase w-screen le permita abarcar todo el ancho,
              pegándose a los bordes de la pantalla.
            */}
            <LastProjects handleDrag={handleEvent} />
          </div>
        </div>
      </SelectPostItLayer>
    </>
  );
}

// Exporta News como default para la configuración de rutas típica
export default News;

function LastProjects({ handleDrag }: { handleDrag: (event: Event) => void }) {
  const lastProjects = getLastProjects(20);

  return (
    <div className="w-screen flex flex-col items-start pl-0 gap-20">
      {lastProjects.map((project: Project, i) => (
        <div key={i} className="w-full flex items-center gap-4">
          <div className="w-75 flex-shrink-0">
            <UnitPostItInfo
              postItProds={project.content[0]}
              handleEvent={handleDrag}
            />
          </div>

          {/* Contenido con título y párrafo */}
          <div className="flex flex-col flex-grow">
            <h2 className="text-2xl font-bold text-gray-800">
              {project.title}
            </h2>
            {project.content.length > 0 && (
              <p className="text-xl text-gray-600 italic text-left">
                {project.content[0].content[0].paragraphs}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
