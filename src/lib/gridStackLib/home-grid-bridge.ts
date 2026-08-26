import type { PostItMapProps } from "#components/PostIts/PostItMap.tsx";

// El grid de Home vive montado (oculto) en TODAS las paginas via
// SelectPostItLayer, en un GridStackProvider que Map.tsx no puede tocar
// directamente (arbol de React separado). Llamar gridstack.addWidget()
// a mano por fuera de React agregaba el postit al DOM pero no al
// _rawWidgetMetaMap que usa GridStackRender para saber que componente
// mostrar dentro -- por eso el postit aparecia transparente/vacio hasta
// recargar la pagina. Este evento le avisa a GlobalGrid (que si tiene
// acceso al addWidget real de React) que agregue el postit correctamente.
export const HOME_GRID_ADD_EVENT = "wamma:add-to-home";

export function requestAddToHomeGrid(content: PostItMapProps) {
  window.dispatchEvent(new CustomEvent<PostItMapProps>(HOME_GRID_ADD_EVENT, { detail: content }));
}
