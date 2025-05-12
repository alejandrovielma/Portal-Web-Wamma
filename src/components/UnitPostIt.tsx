import { COMPONENT_MAP, ComponentDataType, GridStackProvider, GridStackRender, GridStackRenderProvider, useWidgetContext } from "#lib/gridStackLib/index.ts";
import { GridStackOptions } from "gridstack";
import { ComponentProps, useState } from "react";
import PostItInfo from "./PostIts/PostItInfo";

interface PostItProps {
    imageLink: string;
    handleEvent?: (event: Event) => void
}

export function UnitPostIt({imageLink, handleEvent}: PostItProps) {
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
            props: {  imageLink: imageLink },
          } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
        }
      ],
    };
    const [initialOptions] = useState(gridOptions);

    return (
        <GridStackProvider initialOptions={initialOptions}>
            <GridStackRenderProvider onEvent={handleEvent}>
            <GridStackRender componentMap={COMPONENT_MAP} />
            </GridStackRenderProvider>
        </GridStackProvider>
    );
}
export default UnitPostIt;