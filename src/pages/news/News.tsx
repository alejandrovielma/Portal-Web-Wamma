import {NavHeader} from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";
import { useState } from "react";

export function News() {
  const [isDragging, setIsDragging] = useState(false);
  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  return (
    <SelectPostItLayer isDragging={isDragging}>
      <NavHeader
        pathItems={[{ nombre: "Actualidad", link: "/actualidad" }]}
      />
    </SelectPostItLayer>
  );
}

export default News;