import type { GridStack, GridStackOptions, GridStackWidget } from "gridstack";
import { type PropsWithChildren, useCallback, useLayoutEffect, useState } from "react";
import { GridStackContext } from "./grid-stack-context";

export function GridStackProvider({
  children,
  initialOptions,
}: PropsWithChildren<{ initialOptions: GridStackOptions }>) {
  const [gridStack, setGridStack] = useState<GridStack | null>(null);
  const [rawWidgetMetaMap, setRawWidgetMetaMap] = useState(() => {
    const map = new Map<string, GridStackWidget>();
    const deepFindNodeWithContent = (obj: GridStackWidget) => {
      if (obj.id && obj.content) {
        map.set(obj.id, obj);
      }
      if (obj.subGridOpts?.children) {
        obj.subGridOpts.children.forEach((child: GridStackWidget) => {
          deepFindNodeWithContent(child);
        });
      }
    };
    initialOptions.children?.forEach((child: GridStackWidget) => {
      deepFindNodeWithContent(child);
    });
    return map;
  });

  const addWidget = useCallback(
    (fn: (id: string) => Omit<GridStackWidget, "id">) => {
      const newId = `widget-${Math.random().toString(36).substring(2, 15)}`;
      const widget = fn(newId);
      gridStack?.addWidget({ ...widget, id: newId });
      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        newMap.set(newId, widget);
        return newMap;
      });
    },
    [gridStack]
  );

  const addSubGrid = useCallback(
    (
      fn: (
        id: string,
        withWidget: (w: Omit<GridStackWidget, "id">) => GridStackWidget
      ) => Omit<GridStackWidget, "id">
    ) => {
      const newId = `sub-grid-${Math.random().toString(36).substring(2, 15)}`;
      const subWidgetIdMap = new Map<string, GridStackWidget>();

      const widget = fn(newId, (w) => {
        const subWidgetId = `widget-${Math.random()
          .toString(36)
          .substring(2, 15)}`;
        subWidgetIdMap.set(subWidgetId, w);
        return { ...w, id: subWidgetId };
      });

      gridStack?.addWidget({ ...widget, id: newId });

      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        subWidgetIdMap.forEach((meta, id) => {
          newMap.set(id, meta);
        });
        return newMap;
      });
    },
    [gridStack]
  );

  const removeWidget = useCallback(
    (id: string) => {
      gridStack?.removeWidget(`[gs-id="${id}"]`);
      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        newMap.delete(id);
        return newMap;
      });
    },
    [gridStack]
  );

  const saveOptions = useCallback(() => {
    return gridStack?.save(true, true, (_, widget) => widget);
  }, [gridStack]);

  // _rawWidgetMetaMap solo se llenaba a mano (addWidget/addSubGrid), asi
  // que un widget que entra por otra via -- arrastrado desde OTRO grid
  // (ej. la vista previa del panel del mapa hacia Inicio), o restaurado
  // por GridStack al reordenar -- quedaba sin entrada aca. Sin entrada,
  // GridStackRender nunca intenta portar contenido de React adentro, y el
  // postit se ve vacio/transparente hasta que la pagina se remonta y lee
  // todo de nuevo desde localStorage. Escuchar los eventos nativos
  // "added"/"removed" del grid mantiene el mapa sincronizado sin importar
  // como haya entrado o salido el widget.
  useLayoutEffect(() => {
    if (!gridStack) return;

    function handleAdded(_event: Event, items?: GridStackWidget[]) {
      if (!items || items.length === 0) return;
      setRawWidgetMetaMap((prev) => {
        let changed = false;
        const newMap = new Map(prev);
        items.forEach((node) => {
          if (node.id && !newMap.has(node.id)) {
            newMap.set(node.id, node);
            changed = true;
          }
        });
        return changed ? newMap : prev;
      });
    }

    function handleRemoved(_event: Event, items?: GridStackWidget[]) {
      if (!items || items.length === 0) return;
      setRawWidgetMetaMap((prev) => {
        let changed = false;
        const newMap = new Map(prev);
        items.forEach((node) => {
          if (node.id && newMap.has(node.id)) {
            newMap.delete(node.id);
            changed = true;
          }
        });
        return changed ? newMap : prev;
      });
    }

    gridStack.on("added", handleAdded);
    gridStack.on("removed", handleRemoved);
    // No se desuscribe con gridStack.off(): esa API comparte un solo slot
    // por nombre de evento entre TODOS los listeners (ver GlobalWidgetupdater
    // y GridStackRenderProvider, que tambien escuchan "added"/"removed" en
    // esta misma instancia), asi que llamar off() aca podria desconectar el
    // listener de otro componente en vez del propio. El grid entero se
    // destruye al reinicializar o desmontar, asi que el listener no queda
    // huerfano de verdad.
  }, [gridStack]);

  return (
    <GridStackContext.Provider
      value={{
        initialOptions,
        gridStack,

        addWidget,
        removeWidget,
        addSubGrid,
        saveOptions,

        _gridStack: {
          value: gridStack,
          set: setGridStack,
        },
        _rawWidgetMetaMap: {
          value: rawWidgetMetaMap,
          set: setRawWidgetMetaMap,
        },
      }}
    >
      {children}
    </GridStackContext.Provider>
  );
}