import { useState } from "react";
import { GridStackOptions } from "gridstack";
import { GridStackProvider, GridStackRender, GridStackRenderProvider } from "#lib/gridStackLib/index.ts";
import { PostItInfoProps } from "./PostIts/PostItInfo.tsx";
import {COMPONENT_MAP} from "#lib/gridStackLib/index.ts";

interface UnitPostItProps {
    postItProds: PostItInfoProps;
    handleEvent: (event: Event) => void;
    // Un widget mas alto (h>2) hace que PostItInfo muestre titulo y
    // descripcion (ContentMedium) en vez de solo la imagen (ContentSmall)
    // -- se usa para las tarjetas de busqueda en vivo, donde hace falta
    // ver el titulo sin tener que abrir el postit.
    dimensions?: { w: number; h: number };
}



export function UnitPostItInfo({ postItProds, handleEvent, dimensions = { w: 2, h: 2 } }: UnitPostItProps) {
    const [gridOptions] = useState<GridStackOptions>({
        column: dimensions.w,
        row: dimensions.h,
        disableResize: true,
        margin: 0,
        children: [
            {
                // Ver comentario en UnitPostItMap.tsx: un id fijo colisiona
                // en el grid de Inicio en cuanto arrastras dos postits.
                id: `unit-postit-info-${Math.random().toString(36).slice(2, 11)}`,
                h: dimensions.h,
                w: dimensions.w,
                x: 0,
                y: 0,
                content: JSON.stringify({
                    name: "PostItInfo",
                    props: { ...postItProds },
                }),
            }
        ]
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
export default UnitPostItInfo;
