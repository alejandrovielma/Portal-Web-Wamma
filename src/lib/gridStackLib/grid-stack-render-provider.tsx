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
  import { registerGridRenderCB, unregisterGridRenderCB, withInitRenderCB } from "./grid-stack-render-cb-registry";


  interface GridStackRenderProviderProps extends PropsWithChildren {
    onEvent?: GridStackEventHandler;
  }
  
  /**
   * 
   * @param children Para que pueda tener estiquetas dentro
   * @param onEvent Callback para los eventos de gridstack. Se le pasa una funcion de tipo GridStackEventHandler
   * 
   * 
   */
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
        const grid = withInitRenderCB(renderCBFn, () =>
          GridStack.init(optionsRef.current, containerRef.current!)
        );
        registerGridRenderCB(grid, renderCBFn);

        const events = [
          "added",
          "disable",
          "dropped",
          "enable",
          "removed",
          "change",
          "dragstart",
          "drag",
          "dragstop",
          "resizestart",
          "resize",
          "resizestop",
        ];

        events.forEach((eventName) => {
          grid.on(eventName, (event:Event) => {
            onEvent?.(event)
          });
        });

        return grid
      }
      return null;
    }, [renderCBFn, onEvent]);
  
    useLayoutEffect(() => {
      if (initialOptions != optionsRef.current && gridStack) {
        try {
          unregisterGridRenderCB(gridStack);
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

    // Al desmontar (ej. al cambiar de pagina, ya que este provider vive
    // dentro del arbol de cada pagina) hay que sacar esta instancia del
    // registro para que no queden referencias colgando.
    useLayoutEffect(() => {
      return () => {
        if (gridStack) {
          unregisterGridRenderCB(gridStack);
        }
      };
    }, [gridStack]);

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