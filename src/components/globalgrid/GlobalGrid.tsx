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
    columnOpts: {
      breakpoints: [
        { w: 640, c: 1 },
        { w: 1024, c: 4 },
      ],
      layout: "moveScale",
    },
    row: 16,
    cellHeight: 5,
    cellHeightUnit: "rem",
    margin: 2,
    resizable: { handles: "e, se, s, sw, w" },
    alwaysShowResizeHandle: "mobile",
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
        <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center gap-2 opacity-50 px-4 w-full max-w-128">
          <div className="flex flex-col items-center w-full">
            <div className="overflow-hidden w-full max-w-128 h-24 sm:h-40 md:h-60 flex items-center justify-center">
              <img className="object-cover w-full h-full" src="logoDark.svg" alt="Logo Awani" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-center">Wamma</h1>
              <p className="text-base sm:text-xl md:text-3xl text-center">Aprendices del agua</p>
            </div>
          </div>
          <p className="text-base sm:text-xl md:text-3xl text-center">¡Arrastra!</p>
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          <GridStackProvider initialOptions={initialOptions}>
            <GridStackRenderProvider>
              <GridStackRender componentMap={COMPONENT_MAP} />
            </GridStackRenderProvider>
            {/*<DebugInfo />*/}
            <GlobalWidgetupdater />
          </GridStackProvider>
        </div>
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