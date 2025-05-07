import { ComponentProps, useEffect, useState } from "react";
import { GridStackOptions, GridStackWidget } from "gridstack";
import NavBarMenu from "#components/NavBarMenu.jsx";
import BubbleMenu from "#components/BubbleMenu.jsx";
import {
  ComponentDataType,
  ComponentMap,
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
  useGridStackContext,
  COMPONENT_MAP
} from "#lib/gridStackLib/index.js";

import { generateBreadcrumbs, BreadcrumbItem } from "../../lib/header/breadcrumbs"; // Ajusta la ruta si es necesario
import { Header } from "../../lib/header/Header"; // Ajusta la ruta si es necesario

import "./Home.css";
import PostItInfo from "#components/PostItInfo.tsx";

const CELL_HEIGHT = 50;
const BREAKPOINTS = [
  { c: 1, w: 700 },
  { c: 3, w: 850 },
  { c: 6, w: 950 },
  { c: 8, w: 1100 },
];


// ! Content must be json string like this:
// { name: "Text", props: { content: "Item 1" } }
const gridOptions: GridStackOptions = {
  acceptWidgets: true,
  float: true,
  column: 16,
  row: 16,
  cellHeight: 5,
  cellHeightUnit: "rem",
  margin: 2,
  children: [
    {
      id: "item1",
      h: 2,
      w: 2,
      x: 0,
      y: 0,
      content: JSON.stringify({
        name: "PostItInfo",
        props: { content: "Item 1" },
      } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>), // if need type check
    }
  ]
};

export function Home() {
  // ! Uncontrolled
  const [initialOptions] = useState(gridOptions);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  const pathSegments = currentPath.split('/').filter(segment => segment !== '');
  const breadcrumbs: BreadcrumbItem[] = generateBreadcrumbs(pathSegments);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {


  };

  return (
    <GridStackProvider initialOptions={initialOptions}>
      <Header breadcrumbs={breadcrumbs} /> {/* Renderiza el componente Header */}
      <Toolbar />
      <NavBarMenu text="Menu" onClick={handleMenuClick}/>
      <BubbleMenu text="Bubble" onClick={handleMenuClick}/>
      <GridStackRenderProvider>
        <GridStackRender componentMap={COMPONENT_MAP} />
      </GridStackRenderProvider>
      {/* <DebugInfo /> */}
      {/* {navBar()} */} {/* Comentando la función navBar, NavBarMenu y BubbleMenu cumplen una función similar */}
    </GridStackProvider>
  );
}

export default Home;

function Toolbar() {
  const { addWidget, addSubGrid } = useGridStackContext();

  return (
    <div
      className="z-10 fixed bg-white opacity-50"
      style={{
        border: "1px solid gray",
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
      }}
    >
      <button
        onClick={() => {
          addWidget((id) => ({
            w: 2,
            h: 2,
            x: 0,
            y: 0,
            content: JSON.stringify({
              name: "Text",
              props: { content: id },
            }),
          }));
        }}
      >
        Add Text (2x2)
      </button>

      <button
        onClick={() => {
          addSubGrid((id, withWidget) => ({
            h: 5,
            noResize: false,
            sizeToContent: true,
            subGridOpts: {
              acceptWidgets: true,
              columnOpts: { breakpoints: BREAKPOINTS, layout: "moveScale" },
              margin: 8,
              minRow: 2,
              cellHeight: CELL_HEIGHT,
              children: [
                withWidget({
                  h: 1,
                  locked: true,
                  noMove: true,
                  noResize: true,
                  w: 12,
                  x: 0,
                  y: 0,
                  content: JSON.stringify({
                    name: "Text",
                    props: { content: "Sub Grid 1 Title" + id },
                  }),
                }),
              ],
            },
            w: 12,
            x: 0,
            y: 0,
          }));
        }}
      >
        Add Sub Grid (12x1)
      </button>
    </div>
  );
}

// function navBar() { // Comentado para evitar duplicación con NavBarMenu
//   return (
//     <button className="z-10 fixed"
//       style={{
//         border: "1px solid gray",
//         width: "10rem",
//         height: "3rem",
//         backgroundColor: "black",
//         color: "white",
//         fontSize: "1.5rem",
//         padding: "10px",
//         bottom: "0",
//         left: "43%",
//       }}>
//       Menu
//     </button>
//   )
// }

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