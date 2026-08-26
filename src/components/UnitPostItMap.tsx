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
                // Un id fijo ("item2") colisiona en el grid de Inicio en
                // cuanto arrastras dos postits distintos (o el mismo dos
                // veces) -- GridStack renombra el que llega despues, pero
                // termina portando el contenido de React en el contenedor
                // equivocado. Un id unico por instancia lo evita de raiz.
                id: `unit-postit-map-${Math.random().toString(36).slice(2, 11)}`,
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
