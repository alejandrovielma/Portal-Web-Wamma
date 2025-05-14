import DialogInfo from "#components/DialogInfo.tsx";
import {NavHeader} from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostIt from "#components/UnitPostIt.tsx";
import { useState } from "react";
import "./library.css"
import Separator from "#components/Separator.tsx";

export function Library() {
  const [isDragging, setIsDragging] = useState(false);
  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  return (
    <>
      <SelectPostItLayer isDragging={isDragging}>
        <NavHeader
          pathItems={[{ nombre: "Biblioteca", link: "/biblioteca" }]}
        />
        <div className="flex flex-col items-center p-4 pt-24">
          <div className="flex flex-col items-center w-full max-w-6xl">
            <section className="w-full">
              <h2>Ultimos Articulos</h2>
              <span id="articles" className="grid gap-4 justify-between">
                <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleEvent} />
                <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleEvent} />
                <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleEvent} />
              </span>
              <Separator/>
              <h3>Descubre mas sobre la cultura del agua</h3>
              <div id="resources" className="grid gap-x-16 justify-between">
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleEvent} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleEvent} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleEvent} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleEvent} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleEvent} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleEvent} />
                  <UnitPostIt imageLink="images/perro.jpg" onClickInfo={1} handleEvent={handleEvent} />
              </div>
            </section>
          </div>
            
          
        </div>
        
      </SelectPostItLayer>
    </>
    
  );
}

export default Library;
