import { createPortal } from "react-dom";
import { useGridStackContext } from "./grid-stack-context";
import { useGridStackRenderContext } from "./grid-stack-render-context";
import { GridStackWidgetContext } from "./grid-stack-widget-context";
import { GridStackWidget } from "gridstack";
import { ComponentType } from "react";

export interface ComponentDataType<T = object> {
  name: string;
  props: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentMap = Record<string, ComponentType<any>>;

function parseWeightMetaToComponentData(
  meta: GridStackWidget
): ComponentDataType & { error: unknown } {
  let error = null;
  let name = "";
  let props = {};
  try {
    if (meta.content) {
      const result = JSON.parse(meta.content) as {
        name: string;
        props: object;
      };
      name = result.name;
      props = result.props;
    }
  } catch (e) {
    error = e;
  }
  return {
    name,
    props,
    error,
  };
}

export function GridStackRender(props: { componentMap: ComponentMap }) {
  const { _rawWidgetMetaMap } = useGridStackContext();
  const { getWidgetContainer } = useGridStackRenderContext();

  return (
    <>
      {Array.from(_rawWidgetMetaMap.value.entries()).map(([id, meta]) => {
        const componentData = parseWeightMetaToComponentData(meta);

        const WidgetComponent = props.componentMap[componentData.name];

        const widgetContainer = getWidgetContainer(id);

        // GridStack a veces crea el contenedor nativo del widget un
        // instante despues de que React se entera del widget (por ejemplo
        // al arrastrarlo desde otro grid). En vez de crashear toda la app,
        // se salta ese widget por esta pasada -- en cuanto el contenedor
        // se registra, GridStackRenderProvider fuerza un re-render (ver
        // containerVersion) y este componente lo vuelve a intentar.
        if (!widgetContainer) {
          return null;
        }

        return (
          <GridStackWidgetContext.Provider key={id} value={{ widget: { id } }}>
            {createPortal(
              <WidgetComponent {...componentData.props} />,
              widgetContainer
            )}
          </GridStackWidgetContext.Provider>
        );
      })}
    </>
  );
}