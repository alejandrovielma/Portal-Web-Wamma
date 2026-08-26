import React, { ComponentProps, createContext, useContext, useState } from "react";
import { GridStackWidget } from "gridstack";
import { ComponentDataType } from "./grid-stack-render";
import { getAllDestinations } from "../../data/dataBase/repository";
import { WIDGETS_STORAGE_KEY } from "../../global";
import PostItMap from "#components/PostIts/PostItMap.tsx";

type WidgetContextType = {
  widgets: GridStackWidget[];
  setWidgets: (widgets: GridStackWidget[]) => void;
};
const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function GridStackGlobalWidgetProvider({ children }: { children: React.ReactNode }) {
  const [widgets, setWidgetsState] = useState<GridStackWidget[]>(() => {
    const cached = localStorage.getItem(WIDGETS_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (error) {
        console.error("Error parsing cached widgets:", error);
      }
    }

    const destination = getAllDestinations().slice(0, 1);
    const defaultWidgets: GridStackWidget[] = [
      ...destination.map((dest, index) => ({
        id: `destinationDefault${index}`,
        x: 4,
        y: 1,
        w: 8,
        h: 6,
        content: JSON.stringify({
          name: "PostItMap",
          props: {
            ...dest.content
          },
        } satisfies ComponentDataType<ComponentProps<typeof PostItMap>>),
      })),
    ];
    return defaultWidgets;
  });

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
