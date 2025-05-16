import { useState, useEffect } from "react";
import { GridStackOptions } from "gridstack";
import { GridStackProvider, GridStackRender, GridStackRenderProvider } from "#lib/gridStackLib/index.ts";
import { COMPONENT_MAP } from "#lib/gridStackLib/index.ts";
import {PostItInfoAnimalsProps} from "./PostIts/PostItInfoAnimals";


interface UnitPostItInfoPropsAnimals {
  postItProds: PostItInfoAnimalsProps;
  handleEvent: (event: Event) => void;
}

export function UnitPostItInfoAnimals({ postItProds, handleEvent }: UnitPostItInfoPropsAnimals) {
  const [gridOptions, setGridOptions] = useState<GridStackOptions>({
    column: 2,
    row: 2,
    disableResize: true,
    margin: 0,
    children: [
      {
        id: "item_animal",
        h: 2,
        w: 2,
        x: 0,
        y: 0,
        content: JSON.stringify({
          name: "PostItInfoAnimals",
          props: { ...postItProds },
        }),
      },
    ],
  });

  useEffect(() => {
    setGridOptions((prev) => ({
      ...prev,
      children: [
        {
          id: "item_animal",
          h: 2,
          w: 2,
          x: 0,
          y: 0,
          content: JSON.stringify({
            name: "PostItInfoAnimals",
            props: { ...postItProds },
          }),
        },
      ],
    }));
  }, [postItProds]);

  return (
    <div className="w-full h-full min-w-48 max-w-xl">
      <GridStackProvider initialOptions={gridOptions}>
        <GridStackRenderProvider onEvent={handleEvent}>
          <GridStackRender componentMap={COMPONENT_MAP} />
        </GridStackRenderProvider>
      </GridStackProvider>
    </div>
  );
}

export default UnitPostItInfoAnimals;

