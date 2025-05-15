import {NavHeader} from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostIt from "#components/UnitPostIt.tsx";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css";

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
      <MapContainer center={[8.332897505049878, -62.67421343794216]} zoom={13} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="w-screen h-screen"
        />
        <Marker position={[8.332897505049878, -62.67421343794216]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </SelectPostItLayer>
  );
}

export default Map;