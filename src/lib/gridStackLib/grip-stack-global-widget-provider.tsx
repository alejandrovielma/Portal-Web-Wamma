import React, { ComponentProps, createContext, useContext, useEffect, useState } from "react";
import { GridStackWidget } from "gridstack";
import { ComponentDataType } from "./grid-stack-render";
import PostItInfo from "#components/PostIts/PostItInfo.tsx";
import { getAllAnimals, getAllArticles, getAllProjects } from "../../data/dataBase/repository";
import { WIDGETS_STORAGE_KEY } from "../../global";

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
        localStorage.removeItem(WIDGETS_STORAGE_KEY);
      }
    }

    const articles = getAllArticles().slice(0, 1);
    const projects = getAllProjects().slice(0, 2);
    const animals = getAllAnimals().slice(0,3);
    const defaultWidgets: GridStackWidget[] = [
      ...articles.map((article, index) => ({
        id: `articleDefault${index}`,
        x: (index % 2) * 2,
        y: Math.floor(index / 2) * 5,
        w: 3,
        h: 3,
        content: JSON.stringify({
          name: "PostItInfo",
          props: {
            ...article
          },
        } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
      })),

      ...animals.map((animal, index) => ({
        id: `animalDefault${index}`,
        x: (index % 2) * 4,
        y: Math.floor(index / 2) * 5 + 1, 
        w: 3,
        h: 3,
        content: JSON.stringify({
          name: "PostItInfo",
          props: {
            ...animal.content
          },
        } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
      })),

      ...projects.map((project, index) => ({
        id: `projectDefault${index}`,
        x: (index % 2) * 6,
        y: Math.floor(index / 2) * 5 + 2, 
        w: 3,
        h: 3,
        content: JSON.stringify({
          name: "PostItInfo",
          props: {
            ...project
          },
        } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
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
