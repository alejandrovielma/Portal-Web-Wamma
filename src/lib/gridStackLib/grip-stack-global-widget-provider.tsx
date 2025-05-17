import React, { ComponentProps, createContext, useContext, useEffect, useState } from "react";
import { GridStackWidget } from "gridstack";
import { ComponentDataType } from "./grid-stack-render";
import PostItInfo from "#components/PostIts/PostItInfo.tsx";
import PostItMap from "#components/PostIts/PostItMap.tsx";

type WidgetContextType = {
  widgets:  GridStackWidget[];
  setWidgets: (widgets: GridStackWidget[]) => void;
};

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

const WIDGETS_STORAGE_KEY = "gridstack-widgets";

export function GridStackGlobalWidgetProvider({ children }:{ children: React.ReactNode }) {
  const [widgets, setWidgetsState] = useState<GridStackWidget[]>(() => {
    //Carga los widgets en localStorage y si existen los usa
    const cached = localStorage.getItem(WIDGETS_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        console.error("Error parsing cached widgets:", cached);
      }
    }
    // Si no existen, devuelve lso postIt por defecto
    const defaultWidgets: GridStackWidget[] = [
      /*{
        x: 0,
        y: 0,
        w: 4,
        h: 4,
        content: JSON.stringify({
            name: "PostItInfo", // Component que usara
            props: { 

            } 
          } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>
          ),
      },
      {
        x: 4,
        y: 4,
        w: 4,
        h: 4,
        content: JSON.stringify({
            name: "PostItMap", // Component que usara
            props: { 
              
            } 
          } satisfies ComponentDataType<ComponentProps<typeof PostItMap>>
          ),
      }*/
    ]
    return defaultWidgets;
  });

  useEffect(() => {
    localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const setWidgets = (newWidgets: GridStackWidget[]) => {
    setWidgetsState(newWidgets);
  };

  return (
    <WidgetContext.Provider value={{ widgets, setWidgets }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidgetContext must be used within a WidgetProvider");
  }
  return context;
};