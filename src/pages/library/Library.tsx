import {
  BreadcrumbItem,
  NavHeader,
} from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostIt from "#components/UnitPostIt.tsx";
import { useState } from "react";

export function Library() {
  const [isDragging, setIsDragging] = useState(false);
  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  return (
    <SelectPostItLayer isDragging={isDragging}>
      <NavHeader
        pathItems={[{ nombre: "Biblioteca", link: "/biblioteca" }]}
      />

      <div className="size-60">
        <UnitPostIt imageLink="images/homeBg.jpg" onClickInfo={1} handleEvent={handleEvent} />
      </div>
    </SelectPostItLayer>
  );
}

export default Library;
