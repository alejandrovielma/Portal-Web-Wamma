import { NavHeader } from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SliderMapInfo, { RealatesDestination } from "#components/SliderMapInfo.tsx";
import { Destination, getAllDestinations } from "../../data/dataBase/repository";
import { PostItMapProps } from "#components/PostIts/PostItMap.tsx";

function FlyTo({ lat, lng, zoom = 15 }: { lat: number, lng: number, zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
}

export function Map() {
  const [isDragging, setIsDragging] = useState(false);
  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  const destinations = getAllDestinations()
  const [infoSlider, setInfoSlider] = useState<Destination>()
  const [relatedDestinations, setRelatedDestinations] = useState<RealatesDestination[]>([]);
  const [targetCoords, setTargetCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (!infoSlider) return;

    const filtered = destinations
      .filter(
        d =>
          d.type === infoSlider.type &&
          d.content.title !== infoSlider.content.title
      )
      .slice(0, 3)
    const related = filtered.map((destination) => ({
      onClick: () => {
        setInfoSlider(destination);
        setTargetCoords({
          lat: destination.content.coordinates.lat,
          lng: destination.content.coordinates.lng
        });
      },
      content: destination.content,
    }));
    setRelatedDestinations(related);
  }, [infoSlider, destinations]);

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
          {targetCoords && <FlyTo lat={targetCoords.lat} lng={targetCoords.lng} />}
          {
            destinations.map((destination, index) => {
              let icon
              if (destination.type === "tourist") {
                icon = "svgs/seed.svg"
              } else if (destination.type === "reserve") {
                icon = "svgs/drop.svg"
              } else {
                icon = "svgs/seed.svg"
              }

              return (
                <Marker
                  key={index}
                  title={destination.content.title}
                  interactive={true}
                  icon={L.icon({ iconUrl: icon })}
                  position={[destination.content.coordinates.lat, destination.content.coordinates.lng]}
                  eventHandlers={{
                    click: (e) => {
                      setInfoSlider(destination)
                    }
                  }}
                />
              )
            })
          }
        </MapContainer>
        <SliderMapInfo content={infoSlider?.content} realates={relatedDestinations} />
      </div>

    </SelectPostItLayer>
  );
}
export default Map;



