import ExpandedSVG from "#assets/ExpandedSVG.tsx";
import { useState } from "react";
import { PostItMapProps } from "./PostIts/PostItMap";

export function SliderMapInfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside className="absolute pt-24 top-0 right-0 w-96 h-full bg-white/80 shadow-lg p-4 flex flex-col gap-4">
      <header className="flex justify-between items-center gap-4">
        <button className="cursor-pointer" ><ExpandedSVG/></button>
        <h2 className="text-xl flex-1">Titulo</h2>
      </header>
      <div className="flex flex-col gap-8 justify-between h-full">
        <div className="flex flex-col gap-4">
          <img src="images/perro.jpg" alt="" />
          <p>
            descripccion
          </p>
        </div>
        <span className="flex gap-2">
          <RelateCard/>
          <RelateCard/>
          <RelateCard/>
        </span>
      </div>
    </aside>
  )
}
export default SliderMapInfo;

function RelateCard(){


  return (
    <div>
      <img src="images/perro.jpg" alt="" />
    </div>
  )
}