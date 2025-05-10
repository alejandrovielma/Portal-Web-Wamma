import { COMPONENT_MAP, GridStackProvider, GridStackRender, GridStackRenderProvider } from "#lib/gridStackLib/index.ts"
import { ReactNode, useState } from "react"
import { GridStackOptions } from "gridstack";
import { useNavigate } from "react-router-dom";
import { navegateTransitionToMenu } from "#components/TransitionToMenuButton.tsx";

const gridOptions: GridStackOptions = {
  acceptWidgets: true,
  float: true,
  column: 1,
  row: 1,
  disableResize: true,
  margin:0,
  children: [
  ],
};

export function SelectPostItLayer({  children, isLargePadding }: { children?: ReactNode | undefined, isLargePadding: boolean }) {
    const [initialOptions] = useState(gridOptions);
    const navigate = useNavigate();

    function handleEvent(event: Event) {
        if (event.type === 'added') {
            navegateTransitionToMenu(navigate, '/');
        }
    }
    
    return (
        <>
            <div
            className="overflow-hidden transition-all duration-500 delay-200"
            style={{ height: isLargePadding ? '10rem' : '0'}}
            >
                <GridStackProvider initialOptions={initialOptions}>
                    <GridStackRenderProvider onEvent={handleEvent}>
                    <GridStackRender componentMap={COMPONENT_MAP} />
                    </GridStackRenderProvider>
                </GridStackProvider>
            </div>
            <div className="pageContainer">
                {children}
            </div>
        </>
    )
}

export default SelectPostItLayer