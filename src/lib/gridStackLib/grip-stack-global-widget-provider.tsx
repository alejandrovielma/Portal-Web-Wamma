import React, { ComponentProps, createContext, useContext, useEffect, useState } from "react";
import { GridStackOptions, GridStackWidget } from "gridstack";
import PostItInfo from "#components/PostIts/PostItInfo.tsx";
import { ComponentDataType } from "./grid-stack-render";

type WidgetContextType = {
  widgets:  GridStackWidget[];
  setWidgets: (widgets: GridStackWidget[]) => void;
};

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

const WIDGETS_STORAGE_KEY = "gridstack-widgets";

export function GridStackGlobalWidgetProvider({ children }:{ children: React.ReactNode }) {
  const [widgets, setWidgetsState] = useState<GridStackWidget[]>(() => {
    const cached = localStorage.getItem(WIDGETS_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        console.error("Error parsing cached widgets:", cached);
      }
    }
    return [
      {
        id: "item1",
        h: 2,
        w: 2,
        x: 0,
        y: 0,
        content: JSON.stringify({
          name: "PostItInfo",
          props: { title: "Prueba", content: [{paragraphs: ["Esto es un postIt de prueba"]}, {subtitle:"Se sigue probando", paragraphs:["Como se leyo, este postIt se sigue probando"]}], images: ["images/perro.jpg"] },
        } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
      }
    ];
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