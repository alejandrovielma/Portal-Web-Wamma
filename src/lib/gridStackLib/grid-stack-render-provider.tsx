import {
    PropsWithChildren,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
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
    // Fuerza un re-render cada vez que se registra un contenedor nuevo, para
    // que GridStackRender reintente los widgets que se saltó por no
    // encontrar su contenedor todavia (ver comentario en grid-stack-render.tsx).
    const [, forceContainerUpdate] = useState(0);

    const renderCBFn = useCallback(
      (element: HTMLElement, widget: GridStackWidget) => {
        if (widget.id) {
          widgetContainersRef.current.set(widget.id, element);
          forceContainerUpdate((v) => v + 1);
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
              const cached = widgetContainersRef.current.get(widgetId);
              if (cached) return cached;
              // Cuando un widget entra por drag-and-drop desde OTRO grid,
              // GridStack puede reparentar/renombrar el elemento existente
              // sin volver a llamar renderCB, asi que nunca queda
              // registrado aca. Como ultimo recurso se busca directo en
              // el DOM por su atributo gs-id (que GridStack si mantiene
              // actualizado) y se cachea para la proxima vez.
              const fallback = containerRef.current?.querySelector(
                `[gs-id="${widgetId}"] > .grid-stack-item-content`
              );
              if (fallback instanceof HTMLElement) {
                widgetContainersRef.current.set(widgetId, fallback);
                return fallback;
              }
              return null;
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