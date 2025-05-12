import React, { ComponentProps, createContext, useContext, useState } from "react";
import { GridStackOptions, GridStackWidget } from "gridstack";
import PostItInfo from "#components/PostIts/PostItInfo.tsx";
import { ComponentDataType } from "./grid-stack-render";

type WidgetContextType = {
  widgets:  GridStackWidget[];
  setWidgets: (widgets: GridStackWidget[]) => void;
};

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function GridStackGlobalWidgetProvider({ children }:{ children: React.ReactNode }) {
  const [widgets, setWidgetsState] = useState<GridStackWidget[]>([
    {
      id: "item1",
      h: 2,
      w: 2,
      x: 0,
      y: 0,
      content: JSON.stringify({
        name: "PostItInfo",
        props: { content: "Item 1" },
      } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>), // if need type check
    }
  ]);

  const getWidgets = () => widgets;

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