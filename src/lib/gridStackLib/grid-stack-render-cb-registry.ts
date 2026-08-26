import { GridStack, GridStackWidget } from "gridstack";

// GridStack.renderCB es una propiedad ESTATICA (una sola global para toda
// la libreria), pero la app monta VARIAS instancias de grid al mismo tiempo
// -- el grid de Home (oculto en cada pagina) y el mini-grid de vista previa
// de UnitPostItMap dentro del panel del mapa, por ejemplo. Si cada
// GridStackRenderProvider hiciera `GridStack.renderCB = suPropioCallback`,
// el ultimo que se monta/reinicializa le "roba" el renderCB a los demas, y
// los widgets que se agregan despues (por drag entre grids, o por el boton
// "Agregar a Inicio") terminan registrando su contenedor en la referencia
// equivocada -- se ven transparentes o la app crashea con "Widget container
// not found".
//
// Para evitarlo, en vez de pisar GridStack.renderCB directamente, cada
// GridStackRenderProvider se registra aca con su propia instancia de grid,
// y este modulo instala UN SOLO renderCB (una sola vez) que despacha cada
// llamada al provider dueño real del widget (usando `widget.grid`, que
// GridStack ya setea a la instancia correcta antes de llamar renderCB).
type RenderCB = (element: HTMLElement, widget: GridStackWidget) => void;

const registry = new Map<GridStack, RenderCB>();

// GridStack.init() ya llama renderCB de forma SINCRONA para cada widget
// inicial mientras construye la instancia, es decir, ANTES de que init()
// termine de devolver esa instancia -- por lo que todavia no existe un
// objeto grid con el cual registrar en `registry`. Mientras dura esa
// llamada sincrona, se usa este "buzon" temporal en vez del registro por
// instancia (ver withInitRenderCB mas abajo).
let activeInitRenderCB: RenderCB | null = null;

GridStack.renderCB = (element, widget) => {
  const owner = (widget as GridStackWidget & { grid?: GridStack }).grid;
  const cb = (owner && registry.get(owner)) || activeInitRenderCB;
  cb?.(element, widget);
};

export function registerGridRenderCB(grid: GridStack, cb: RenderCB) {
  registry.set(grid, cb);
}

export function unregisterGridRenderCB(grid: GridStack) {
  registry.delete(grid);
}

/** Envuelve GridStack.init() para que sus widgets iniciales tambien se registren en el proveedor correcto. */
export function withInitRenderCB<T>(cb: RenderCB, fn: () => T): T {
  const previous = activeInitRenderCB;
  activeInitRenderCB = cb;
  try {
    return fn();
  } finally {
    activeInitRenderCB = previous;
  }
}
