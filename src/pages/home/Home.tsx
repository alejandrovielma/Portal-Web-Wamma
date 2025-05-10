import { ComponentProps, useEffect, useState, useRef } from "react";
import { GridStackOptions, GridStackWidget } from "gridstack";
import NavMenu from "#components/NavMenu.js";
import {
  ComponentDataType,
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
  useGridStackContext,
  COMPONENT_MAP
} from "#lib/gridStackLib/index.js";

import "./Home.css";
import PostItInfo from "#components/PostIts/PostItInfo.tsx";
import { TransitionToPage } from "#components/TransitionToPage.tsx";

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
  const [isBubbleMenuVisible, setIsBubbleMenuVisible] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [initialOptions] = useState(gridOptions);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsBubbleMenuVisible(!isBubbleMenuVisible);
  };

  const handleCloseBubbleMenu = () => {
    setIsBubbleMenuVisible(false);
  };

  

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setIsDragging(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setIsDragging(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setDragStart({ x: event.clientX, y: event.clientY });
      setScrollStart({
        x: event.currentTarget.scrollLeft,
        y: event.currentTarget.scrollTop,
      });
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;

      event.currentTarget.scrollLeft = scrollStart.x - dx;
      event.currentTarget.scrollTop = scrollStart.y - dy;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <div className="overflow-hidden h-screen"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "default" }}
      >
        <GridStackProvider initialOptions={initialOptions}>
          <Toolbar />
          <NavMenu text="Menu" isVisible={isBubbleMenuVisible} onClick={handleMenuClick} ref={menuButtonRef}/>
          <GridStackRenderProvider>
            <GridStackRender componentMap={COMPONENT_MAP} />
          </GridStackRenderProvider>
          {/* <DebugInfo /> */}
        </GridStackProvider>
      </div>
      <TransitionToPage/>
    </>
  );
}

export default Home;

function Toolbar() {
  const { addWidget, addSubGrid } = useGridStackContext();

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

      {/*<button
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
                    name: "PostItInfo",
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
      </button>*/}
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