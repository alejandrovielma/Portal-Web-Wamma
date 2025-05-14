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
import LogoSVG from "#assets/LogoSVG.tsx";

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
            <Toolbar />
            <GridStackRenderProvider>
                <GridStackRender componentMap={COMPONENT_MAP} />
            </GridStackRenderProvider>
            {/*<DebugInfo />*/}
            <GlobalWidgetupdater/>
        </GridStackProvider>
        <div className="absolute left-1/2 top-1/2 -translate-1/2">
          <LogoSVG className="opacity-70 size-80"/>
        </div>
      </div>
    )
}
export default GlobalGrip

function Toolbar() {
  const { addWidget } = useGridStackContext();

  return (
    <div
      className="z-10 flex gap-8 fixed bg-white/50 top-0 right-0 m-4 p-4 rounded-lg shadow-md"
    >
      <button
        onClick={() => {
          addWidget((id) => ({
            w: 2,
            h: 2,
            x: 0,
            y: 0,
            content: JSON.stringify({
              name: "PostItInfo",
              props: { content: id },
            }),
          }));
        }}
      >
        Add Card Info (2x2)
      </button>
      <button
        onClick={() => {
          addWidget((id) => ({
            w: 2,
            h: 2,
            x: 0,
            y: 0,
            content: JSON.stringify({
              name: "PostItLink",
              props: { content: id },
            }),
          }));
        }}
      >
        Add Card Link (2x2)
      </button>
    </div>
  );
}

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