import "./globalGrid.css"
import { useState } from "react";
import { GridStackOptions } from "gridstack";
import {
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
  COMPONENT_MAP,
  useWidgetContext,
  GlobalWidgetupdater
} from "#lib/gridStackLib/index.js";

export function GlobalGrip() {
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
      {/*<header className="bg-light-tertiary px-4 text-white flex items-center gap-4 h-20 fixed w-full z-50">
        <img src="logo.svg" alt="Logo Awani" className="size-24" />
        <div>
          <h1 className="text-2lx font-semibold text-start">Wamma</h1>
          <p className="text-sm">Aprendices del agua</p>
        </div>
      </header>*/}
      <div>
        <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="flex flex-col items-center">
            <div className="overflow-hidden w-128 h-60 flex items-center justify-center">
              <img className="object-cover w-full h-full" src="logoDark.svg" alt="Logo Awani" />
            </div>
            <div>
              <h1 className="text-5xl font-semibold text-start">Wamma</h1>
              <p className="text-3xl text-start">Aprendices del agua</p>
            </div>
          </div>
          <p className="text-3xl text-center">¡Arrastra!</p>
        </div>
        <GridStackProvider initialOptions={initialOptions}>
          <GridStackRenderProvider>
            <GridStackRender componentMap={COMPONENT_MAP} />
          </GridStackRenderProvider>
          {/*<DebugInfo />*/}
          <GlobalWidgetupdater />
        </GridStackProvider>
      </div>
    </div>
  )
}
export default GlobalGrip


/*function DebugInfo() {
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
}*/