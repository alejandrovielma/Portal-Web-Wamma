import React, { ComponentProps, createContext, useContext, useEffect, useState } from "react";
import { GridStackWidget } from "gridstack";
import { ComponentDataType } from "./grid-stack-render";
import PostItInfo from "#components/PostIts/PostItInfo.tsx";
import PostItMap from "#components/PostIts/PostItMap.tsx";
import { image, video } from "framer-motion/client";
import { getAllArticles } from "../../data/dataBase/repository";

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
      } catch (error) {
        console.error("Error parsing cached widgets:", error);
        localStorage.removeItem(WIDGETS_STORAGE_KEY); 
      }
    }


    const articles = getAllArticles().slice(0, 4);
    const defaultWidgets: GridStackWidget[] = articles.map((article, index) => {
      const x = (index % 2) * 4;
      const y = Math.floor(index / 2) * 5;
      const images = article.images && article.images.length > 0
        ? article.images.map((img, i) => ({
            url: img,
            alt: `Image ${i + 1}`,
          }))
        : [];
      const videos = article.video
        ? [{ url: article.video, title: "Video" }]
        : [];
      const content = article.content.map(c => {
        if (c.paragraphs) {
          return { type: "paragraph", content: c.paragraphs.join("\n") };
        } else if (c.subtitle) {
          return { type: "subtitle", content: c.subtitle };
        }
        return {};
      });

      return {
        x: x,
        y: y,
        w: 2,
        h: 2,
        content: JSON.stringify({
          name: "PostItInfo",
          props: {
            title: article.title,
            content: content,
            images: images,
            video: videos,
          },
        } satisfies ComponentDataType<ComponentProps<typeof PostItInfo>>),
      };
    });
    return defaultWidgets;
  });

  useEffect(() => {
    if (widgets.length > 0) { 
        localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(widgets));
    }
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
