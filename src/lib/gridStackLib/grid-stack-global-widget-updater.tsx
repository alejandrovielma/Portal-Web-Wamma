import { GridStackWidget } from "gridstack";
import { useEffect } from "react";
import { useGridStackContext } from "./grid-stack-context";
import { useWidgetContext } from "./grip-stack-global-widget-provider";
import { WIDGETS_STORAGE_KEY } from "../../global";

export function GlobalWidgetupdater(){
  const { saveOptions, gridStack } = useGridStackContext();
  const { setWidgets } = useWidgetContext();

  useEffect(() => {
    if (!gridStack) return;

    const handleGridChange = () => {
      if (saveOptions) {
        const data = saveOptions()["children"] as GridStackWidget[];
        console.log("GridStack data saved to localStorage:", data);
        setWidgets(data);
        localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(data));
      }
    };

    gridStack.on("dragstop", handleGridChange);
    gridStack.on("added", handleGridChange);
    gridStack.on("removed", handleGridChange);
    gridStack.on("resizestop", handleGridChange);

    // Limpieza: eliminar el listener cuando el componente se desmonte
    return () => {
      gridStack.off("dragstop")
      gridStack.off("added")
      gridStack.off("removed")
      gridStack.off("resizestop")
    };
  }, [gridStack, saveOptions, setWidgets]);

  return(
    <></>
  )
}

export default GlobalWidgetupdater;