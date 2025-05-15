import "./globalGrid.css"
import { useEffect, useState } from "react";
import { GridStackOptions, GridStackWidget } from "gridstack";
import {
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
  useGridStackContext,
  COMPONENT_MAP,
  useWidgetContext,
  GlobalWidgetupdater
} from "#lib/gridStackLib/index.js";

export function GlobalGrip(){
    const { widgets } = useWidgetContext();

    const gridOptions: GridStackOptions = {
        acceptWidgets: true,
        float: true,
        column: 16,
        row: 16,
        cellHeight: 5,
        cellHeightUnit: "rem",
        margin: 2,
        children: widgets
    };
    const [initialOptions] = useState(gridOptions)

    return (
      <div className="bgGrid">
        <GridStackProvider initialOptions={initialOptions}>
            <GridStackRenderProvider>
                <GridStackRender componentMap={COMPONENT_MAP} />
            </GridStackRenderProvider>
            {/*<DebugInfo />*/}
            <GlobalWidgetupdater/>
        </GridStackProvider>
      </div>
    )
}
export default GlobalGrip


function DebugInfo() {
  const { initialOptions, saveOptions } = useGridStackContext();

  const [realtimeOptions, setRealtimeOptions] = useState<
    GridStackOptions | GridStackWidget[] | undefined
  >(undefined);

  useEffect(() => {
    const timer = setInterval(() => {
      if (saveOptions) {
        const data = saveOptions();
        setRealtimeOptions(data);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [saveOptions]);

  return (
    <div>
      <h2>Debug Info</h2>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <div>
          <h3>Initial Options</h3>
          <pre
            style={{
              backgroundColor: "#f3f4f6",
              padding: "1rem",
              borderRadius: "0.25rem",
              overflow: "auto",
            }}
          >
            {JSON.stringify(initialOptions, null, 2)}
          </pre>
        </div>
        <div>
          <h3>Realtime Options (2s refresh)</h3>
          <pre
            style={{
              backgroundColor: "#f3f4f6",
              padding: "1rem",
              borderRadius: "0.25rem",
              overflow: "auto",
            }}
          >
            {JSON.stringify(realtimeOptions, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}