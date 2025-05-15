import {NavHeader} from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostIt from "#components/UnitPostIt.tsx";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ExpandedSVG from "#assets/ExpandedSVG.tsx";

export function Map() {
  const [isDragging, setIsDragging] = useState(false);
  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  return (
    <SelectPostItLayer isDragging={isDragging}>
      <NavHeader
        pathItems={[{ nombre: "Mapa", link: "/mapa" }]}
      />
      <div className="relative w-full h-full pt-20">
        <MapContainer center={[8.332897505049878, -62.67421343794216]} zoom={13} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="w-screen h-screen"
          />
          <Marker
          icon={L.icon({iconUrl:"logo.svg"})}
          position={[8.332897505049878, -62.67421343794216]}
          eventHandlers={{
            click: (e)=>{}
          }}
          >
          </Marker>
        </MapContainer>
        <SliderInfoContainer/>
      </div>
      
    </SelectPostItLayer>
  );
}
export default Map;

function SliderInfoContainer() {
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

function RelateCard(){


  return (
    <div>
      <img src="images/perro.jpg" alt="" />
    </div>
  )
}