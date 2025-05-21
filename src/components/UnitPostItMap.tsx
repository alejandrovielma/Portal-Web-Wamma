import { useState } from "react";
import { GridStackOptions } from "gridstack";
import { GridStackProvider, GridStackRender, GridStackRenderProvider } from "#lib/gridStackLib/index.ts";
import {COMPONENT_MAP} from "#lib/gridStackLib/index.ts";
import { PostItMapProps } from "./PostIts/PostItMap.tsx";

interface UnitPostItProps {
    postItProds: PostItMapProps;
    handleEvent: (event: Event) => void;
}

export function UnitPostItMap({ postItProds, handleEvent }: UnitPostItProps) {
    const [gridOptions] = useState<GridStackOptions>({
        column: 2,
        row: 2,
        disableResize: true,
        margin: 0,
        children: [
            {
                id: "item2",
                h: 2,
                w: 2,
                x: 0,
                y: 0,
                content: JSON.stringify({
                    name: "PostItMap",
                    props: { ...postItProds },
                }),
            }
        ],
    });

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
export default UnitPostItMap;
