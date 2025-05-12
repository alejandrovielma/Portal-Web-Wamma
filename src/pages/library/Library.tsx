// Archivo: Library.tsx

import { BreadcrumbItem, NavHeader } from "#components/NavHeader.tsx"; // Asegúrate de que la ruta sea correcta
import PostItInfo from "#components/PostIts/PostItInfo.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import {
  COMPONENT_MAP,
  ComponentDataType,
  ComponentProps,
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
} from "#lib/gridStackLib/index.ts";
import { GridStackOptions } from "gridstack";
import { useState } from "react";

const gridOptions: GridStackOptions = {
  acceptWidgets: true,
  float: true,
  column: 1,
  row: 1,
  disableResize: true,
  margin: 0,
  children: [
    {
      id: "item1",
      h: 1,
      w: 1,
      x: 0,
      y: 0,
      content: JSON.stringify({
        name: "PostItInfo",
        props: { content: "Item 1" },
      } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
    },
  ],
};

export function Library() {
  const [initialOptions] = useState(gridOptions);
  const [isDragging, setIsDragging] = useState(false);

  const pageTitle = "Inicio";

  const libraryBreadcrumbs: BreadcrumbItem[] = [
    { nombre: "Biblioteca", link: "/biblioteca" },
    // En caso de tener más niveles
    // { nombre: "Categoría", link: "/biblioteca/categoria" },
    // { nombre: "Detalle", link: "/biblioteca/categoria/detalle" },
  ];
  // -------------------------------------------------------------

  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  return (
    <SelectPostItLayer isLargePadding={isDragging}>
      <NavHeader titulo={pageTitle} pathItems={libraryBreadcrumbs} />
      <div className="size-60">
        <GridStackProvider initialOptions={initialOptions}>
          <GridStackRenderProvider onEvent={handleEvent}>
            <GridStackRender componentMap={COMPONENT_MAP} />
          </GridStackRenderProvider>
        </GridStackProvider>
      </div>
    </SelectPostItLayer>
  );
}

export default Library;
