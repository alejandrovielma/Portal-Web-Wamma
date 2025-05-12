import { BreadcrumbItem, generateBreadcrumbs, NavHeader } from "#components/NavHeader.tsx";
import PostItInfo from "#components/PostIts/PostItInfo.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import { COMPONENT_MAP, ComponentDataType, GridStackProvider, GridStackRender, GridStackRenderProvider, useWidgetContext } from "#lib/gridStackLib/index.ts";
import { GridStackOptions } from "gridstack";
import { ComponentProps, useState } from "react";

const gridOptions: GridStackOptions = {
  column: 2,
  row: 2,
  disableResize: true,
  margin:0,
  children: [
    {
      id: "item2",
      h: 2,
      w: 2,
      x: 0,
      y: 0,
      content: JSON.stringify({
        name: "PostItInfo",
        props: { content: "Item 2" },
      } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
    }
  ],
};

export function Library() {
    const [initialOptions] = useState(gridOptions);

    const [isDragging, setIsDragging] = useState(false);
    function handleEvent(event: Event) {
        setIsDragging(event.type === 'dragstart');
    }

    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = generateBreadcrumbs(pathSegments);

    return (
        <SelectPostItLayer isDragging={isDragging}>
            <NavHeader breadcrumbs={breadcrumbs} />
            <div className="size-60">
                <GridStackProvider initialOptions={initialOptions}>
                    <GridStackRenderProvider onEvent={handleEvent}>
                    <GridStackRender componentMap={COMPONENT_MAP} />
                    </GridStackRenderProvider>
                </GridStackProvider>
            </div>
        </SelectPostItLayer>
    )
}
export default Library;