import React, { createContext, useContext, useEffect, useState } from "react";
import { GridStackWidget } from "gridstack";

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
    return [];
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