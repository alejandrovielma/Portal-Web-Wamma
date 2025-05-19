import React, { ComponentProps, createContext, useContext, useEffect, useState } from "react";
import { GridStackWidget } from "gridstack";
import { ComponentDataType } from "./grid-stack-render";
import PostItInfo from "#components/PostIts/PostItInfo.tsx";
import { getAllAnimals, getAllArticles, getAllDestinations, getAllProjects, getLastArticles, getLastProjects } from "../../data/dataBase/repository";
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

    const articles = getLastArticles(1);
    const projects = getLastProjects(2)
    const animals = getAllAnimals().slice(0,3);
    const destination = getAllDestinations().slice(0, 1);
    const defaultWidgets: GridStackWidget[] = [
      ...articles.map((article, index) => ({
        id: `articleDefault${index}`,
        x: 11,
        y: 0,
        w: 5,
        h: 4,
        content: JSON.stringify({
          name: "PostItInfo",
          props: {
            ...article
          },
        } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
      })),

      ...animals.map((animal, index) => ({
        id: `animalDefault${index}`,
        x: 0,
        y: 5 + 3 * index, 
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
        x: 12 ,
        y: 5 + index* 3, 
        w: 4,
        h: 3,
        content: JSON.stringify({
          name: "PostItInfo",
          props: {
            ...project
          },
        } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
      })),

      ...destination.map((dest, index) => ({
        id: `destinationDefault${index}`,
        x: 0,
        y: 0,
        w: 7,
        h: 4,
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
