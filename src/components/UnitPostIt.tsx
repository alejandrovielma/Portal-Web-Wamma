import { COMPONENT_MAP, ComponentDataType, GridStackProvider, GridStackRender, GridStackRenderProvider, useGridStackContext, useWidgetContext } from "#lib/gridStackLib/index.ts";
import { GridStackOptions } from "gridstack";
import { ComponentProps, useState } from "react";
import PostItInfo from "./PostIts/PostItInfo";

interface PostItProps {
    imageLink: string;
    onClickInfo: number
    handleEvent: (event: Event) => void;
}

export function UnitPostIt({imageLink, onClickInfo, handleEvent}: PostItProps) {
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
            props: {  imageLink: imageLink, onClickInfo: onClickInfo },
          } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
        }
      ],
      
    };
    const [initialOptions] = useState(gridOptions);

    return (
      <div className="w-full h-full min-w-48 max-w-xl">
        <GridStackProvider initialOptions={initialOptions}>
          <GridStackRenderProvider onEvent={handleEvent}>
          <GridStackRender componentMap={COMPONENT_MAP} />
          </GridStackRenderProvider>
        </GridStackProvider>
      </div>
    );
}
export default UnitPostIt;