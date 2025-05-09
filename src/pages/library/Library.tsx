import { BreadcrumbItem, generateBreadcrumbs, NavHeader } from "#components/NavHeader.tsx";
import PostItBase from "#components/PostIts/PostItBase.tsx";
import { ComponentDataType, ComponentMap, GridStackProvider, GridStackRender, GridStackRenderProvider } from "#lib/gridStackLib/index.ts";
import { GridStackOptions } from "gridstack";
import { ComponentProps, useEffect, useState } from "react";


function Text({ content }: { content: string }) {
  return <div className="w-full h-full">{content}</div>;
}

const COMPONENT_MAP: ComponentMap = {
  Text,
  // ... other components here
};

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
        name: "Text",
        props: { content: "Item 1" },
      } satisfies ComponentDataType<ComponentProps<typeof Text>>), // if need type check
    }
  ],
};

export function Library() {
    const [initialOptions] = useState(gridOptions);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = generateBreadcrumbs(pathSegments);

    function handleEvent(event: Event) {
        console.log("Event triggered:", event);
    }

    return (
        <>
            <NavHeader breadcrumbs={breadcrumbs} />
            <div className="size-60">
                <GridStackProvider initialOptions={initialOptions}>
                    <GridStackRenderProvider onEvent={handleEvent}>
                    <GridStackRender componentMap={COMPONENT_MAP} />
                    </GridStackRenderProvider>
                </GridStackProvider>
            </div>
        </>
    )
}
export default Library;