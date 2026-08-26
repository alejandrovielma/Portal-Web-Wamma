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

    // GridStack.renderCB es una propiedad estatica GLOBAL, compartida por
    // TODAS las instancias de grid de la app (no es por-instancia). Si hay
    // mas de un GridStackRenderProvider montado a la vez -- por ejemplo el
    // grid de Home (oculto) y el mini-grid de UnitPostItMap dentro del
    // panel del mapa -- el que se monto/renderizo ultimo le "roba" el
    // renderCB al otro. Por eso, justo antes de agregar un widget mediante
    // el addWidget() imperativo (ej. boton "Agregar a Inicio"), hay que
    // reclamar el renderCB para asegurarse de que los nuevos contenedores
    // se registren en la referencia correcta.
    const reclaimRenderCB = useCallback(() => {
      GridStack.renderCB = renderCBFn;
    }, [renderCBFn]);
  
    const initGrid = useCallback(() => {
      if (containerRef.current) {
        GridStack.renderCB = renderCBFn;
        const grid = GridStack.init(optionsRef.current, containerRef.current)

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
            reclaimRenderCB,
          }),
          // ! gridStack is required to reinitialize the grid when the options change
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [gridStack, reclaimRenderCB]
        )}
      >
        <div ref={containerRef}>{gridStack ? children : null}</div>
      </GridStackRenderContext.Provider>
    );
  }