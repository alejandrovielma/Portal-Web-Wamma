import {NavHeader} from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostIt from "#components/UnitPostIt.tsx";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ExpandedSVG from "#assets/ExpandedSVG.tsx";
import SliderMapInfo from "#components/SliderMapInfo.tsx";

export function Map() {
  const [isDragging, setIsDragging] = useState(false);
  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  //const [infoSlider, setInfoSlider] = useState<>()

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
          title="Prueba"
          interactive={true}
          icon={L.icon({iconUrl:"svgs/drop.svg"})}
          position={[8.332897505049878, -62.67421343794216]}
          eventHandlers={{
            click: (e)=>{}
          }}
          />
          <Marker
          title="Prueba"
          interactive={true}
          icon={L.icon({iconUrl:"svgs/seed.svg"})}
          position={[8.342897505049878, -62.67421343794216]}
          eventHandlers={{
            click: (e)=>{}
          }}
          />
        </MapContainer>
        <SliderMapInfo/>
      </div>
      
    </SelectPostItLayer>
  );
}
export default Map;



