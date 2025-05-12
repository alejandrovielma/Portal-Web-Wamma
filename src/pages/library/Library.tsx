import { BreadcrumbItem, generateBreadcrumbs, NavHeader } from "#components/NavHeader.tsx";
import PostItInfo from "#components/PostIts/PostItInfo.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import { COMPONENT_MAP, ComponentDataType, ComponentMap, GlobalWidgetupdater, GridStackProvider, GridStackRender, GridStackRenderProvider, useWidgetContext } from "#lib/gridStackLib/index.ts";
import { GridStackOptions } from "gridstack";
import { ComponentProps, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const gridOptions: GridStackOptions = {
  acceptWidgets: true,
  float: true,
  column: 1,
  row: 1,
  disableResize: true,
  margin:0,
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
      } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>), // if need type check
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

    

    const { widgets } = useWidgetContext();
    const gridOptions2: GridStackOptions = {
      acceptWidgets: true,
      float: true,
      column: 16,
      row: 16,
      cellHeight: 5,
      cellHeightUnit: "rem",
      margin: 2,
      children: widgets
    };
    const [initialOptions2] = useState(gridOptions2)

    return (
        <SelectPostItLayer isLargePadding={isDragging}>
            <NavHeader breadcrumbs={breadcrumbs} />
            <div className="size-60">
                <GridStackProvider initialOptions={initialOptions}>
                    <GridStackRenderProvider onEvent={handleEvent}>
                    <GridStackRender componentMap={COMPONENT_MAP} />
                    </GridStackRenderProvider>
                </GridStackProvider>
            </div>
            <GridStackProvider initialOptions={initialOptions2}>
              <GridStackRenderProvider>
                <GridStackRender componentMap={COMPONENT_MAP} />
              </GridStackRenderProvider>
              <GlobalWidgetupdater/>
            </GridStackProvider>
        </SelectPostItLayer>
    )
}
export default Library;