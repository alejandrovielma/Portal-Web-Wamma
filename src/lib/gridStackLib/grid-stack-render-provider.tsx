import {
    PropsWithChildren,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
  } from "react";
  import { useGridStackContext } from "./grid-stack-context";
  import { GridStack, GridStackEventHandler, GridStackOptions, GridStackWidget } from "gridstack";
  import { GridStackRenderContext } from "./grid-stack-render-context";


  interface GridStackRenderProviderProps extends PropsWithChildren {
    onEvent?: GridStackEventHandler;
  }
  
  export function GridStackRenderProvider({ children, onEvent, }: GridStackRenderProviderProps) {
    const {
      _gridStack: { value: gridStack, set: setGridStack },
      initialOptions,
    } = useGridStackContext();
  
    const widgetContainersRef = useRef<Map<string, HTMLElement>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<GridStackOptions>(initialOptions);
  
    const renderCBFn = useCallback(
      (element: HTMLElement, widget: GridStackWidget) => {
        if (widget.id) {
          widgetContainersRef.current.set(widget.id, element);
        }
      },
      []
    );
  
    const initGrid = useCallback(() => {
      if (containerRef.current) {
        GridStack.renderCB = renderCBFn;
        const grid = GridStack.init(optionsRef.current, containerRef.current)

        grid.on("dragstart", (event, el) => {
          //console.log("Drag started:", event);
          onEvent?.( event );
        });
  
        grid.on("drag", (event, el) => {
          onEvent?.(event);
        });
  
        grid.on("dragstop", (event, el) => {
          onEvent?.(event);
        });
  
        grid.on("resize", (event, el) => {
          onEvent?.(event);
        });
  
        grid.on("change", (event, items) => {
          onEvent?.(event);
        });

        return grid
      }
      return null;
    }, [renderCBFn, onEvent]);
  
    useLayoutEffect(() => {
      if (initialOptions != optionsRef.current && gridStack) {
        try {
          gridStack.removeAll(false);
          gridStack.destroy(false);
          widgetContainersRef.current.clear();
          optionsRef.current = initialOptions;
          setGridStack(initGrid());
        } catch (e) {
          console.error("Error reinitializing gridstack", e);
        }
      }
    }, [initialOptions, gridStack, initGrid, setGridStack]);
  
    useLayoutEffect(() => {
      if (!gridStack) {
        try {
          setGridStack(initGrid());
        } catch (e) {
          console.error("Error initializing gridstack", e);
        }
      }
    }, [gridStack, initGrid, setGridStack]);
  
    return (
      <GridStackRenderContext.Provider
        value={useMemo(
          () => ({
            getWidgetContainer: (widgetId: string) => {
              return widgetContainersRef.current.get(widgetId) || null;
            },
          }),
          // ! gridStack is required to reinitialize the grid when the options change
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [gridStack]
        )}
      >
        <div ref={containerRef}>{gridStack ? children : null}</div>
      </GridStackRenderContext.Provider>
    );
  }