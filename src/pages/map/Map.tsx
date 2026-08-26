import { NavHeader } from "#components/NavHeader.tsx";
import SelectPostItLayer from "#components/SelectPostItLayer.tsx";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SliderMapInfo, { RealatesDestination } from "#components/SliderMapInfo.tsx";
import { Destination, getAllDestinations, getAllLocations, MapLocation } from "../../data/dataBase/repository";
import { useLocation } from "react-router-dom";
import LiveLocationSearch from "#components/LiveLocationSearch.tsx";
import { LiveLocationResult, getRecentSearches } from "#lib/liveLocationSearch.ts";
import { requestAddToHomeGrid } from "#lib/gridStackLib/home-grid-bridge.ts";

function liveResultToDestination(result: LiveLocationResult): Destination {
  return {
    type: "online",
    content: {
      title: result.name,
      description: result.description ?? "Todavía no hay una descripción disponible para este lugar.",
      images: result.images,
      video: "",
      coordinates: { lat: result.lat, lng: result.lng },
      city: result.city ?? undefined,
    },
  };
}

export function Map() {
  const [isDragging, setIsDragging] = useState(false);
  function handleEvent(event: Event) {
    setIsDragging(event.type === "dragstart");
  }

  const location = useLocation();

  const destinations = getAllDestinations()
  const mapLocations = getAllLocations()
  const [displayLocation] = useState<string>("");
  const [infoSlider, setInfoSlider] = useState<Destination>()
  const [relatedDestinations, setRelatedDestinations] = useState<RealatesDestination[]>([]);
  const [targetCoords, setTargetCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [targetZoom, setTargetZoom] = useState<number>(15);
  const [liveLocation, setLiveLocation] = useState<LiveLocationResult | null>(null);
  const [addedToHome, setAddedToHome] = useState(false);
  const isViewingLiveResult = infoSlider?.type === "online";

  useEffect(() => {
    setAddedToHome(false);
    if (!infoSlider) return;

    const filtered = destinations
      .filter(
        d =>
          d.type === infoSlider.type &&
          d.content.title !== infoSlider.content.title
      )
      .slice(0, 3)
    const curatedRelated = filtered.map((destination) => ({
      onClick: () => {
        setInfoSlider(destination);
        setTargetCoords({
          lat: destination.content.coordinates.lat,
          lng: destination.content.coordinates.lng
        });
      },
      content: destination.content,
    }));

    // No son "busquedas recientes" en el sentido estricto -- son otros
    // lugares que la persona ya visito por aca, asi que se muestran
    // junto con los destinos curados como "otros lugares para visitar",
    // sin importar si el panel abierto ahora mismo es curado o en vivo.
    const recentRelated = getRecentSearches()
      .filter((r) => r.name !== infoSlider.content.title)
      .slice(0, 2)
      .map((r) => ({
        onClick: () => {
          setLiveLocation(r);
          setInfoSlider(liveResultToDestination(r));
          setTargetZoom(15);
          setTargetCoords({ lat: r.lat, lng: r.lng });
        },
        content: liveResultToDestination(r).content,
      }));

    setRelatedDestinations([...curatedRelated, ...recentRelated]);
  }, [infoSlider, destinations]);

  useEffect(() => {
    if (location.state && location.state.coordinates) {
      setTargetZoom(15);
      const { lat, lng } = location.state.coordinates;
      setTargetCoords({ lat, lng });
      const found = destinations.find(
        d => d.content.coordinates.lat === lat && d.content.coordinates.lng === lng
      );
      if (found) setInfoSlider(found);
    }
  }, [location.state, destinations]);


  return (
    <SelectPostItLayer isDragging={isDragging}>
      <NavHeader
        pathItems={[{ nombre: "Mapa", link: "/mapa" }]}
      />
      <div className="relative w-full h-full pt-14 sm:pt-20">
        <LiveLocationSearch
          onResult={(result) => {
            setLiveLocation(result);
            setInfoSlider(liveResultToDestination(result));
            setTargetZoom(15);
            setTargetCoords({ lat: result.lat, lng: result.lng });
          }}
        />
        {/*<DropOptions className="mt-40" title="Regiones" items={mapLocations.map(loca => {
          const item = {
            text: loca.name,
            onClick: () => {
              setDisplayLocation(loca.name)
              setInfoSlider({
                type: "Location",
                content: {
                  title: loca.name,
                  description: "",
                  images: [""],
                  video: "",
                  coordinates: {
                    lat: loca.bonds[0][0],
                    lng: loca.bonds[0][1]
                  },
                }
              })
              setTargetZoom(8)
              setTargetCoords({
                lat: loca.bonds[0][0],
                lng: loca.bonds[0][1]
              });
            }
          }
          return item
        })} />*/}
        <MapContainer center={[8.332897505049878, -62.67421343794216]} zoom={13} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="w-screen h-screen"
          />
          {targetCoords && <FlyTo lat={targetCoords.lat} lng={targetCoords.lng} zoom={targetZoom} />}
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
                    click: () => {
                      setInfoSlider(destination)
                    }
                  }}
                />
              )
            })
          }
          <RenderLocation displayLocation={displayLocation} locations={mapLocations} />
          {liveLocation && (
            <Marker
              title={liveLocation.name}
              interactive={true}
              icon={L.icon({ iconUrl: "svgs/seed.svg" })}
              position={[liveLocation.lat, liveLocation.lng]}
              eventHandlers={{
                click: () => {
                  setInfoSlider(liveResultToDestination(liveLocation));
                }
              }}
            />
          )}
        </MapContainer>
        <SliderMapInfo
          content={infoSlider?.content}
          realates={relatedDestinations}
          handleDrag={handleEvent}
          onClose={() => setInfoSlider(undefined)}
          isLiveResult={isViewingLiveResult}
          liveFacts={isViewingLiveResult ? liveLocation?.facts : undefined}
          liveSourceUrl={isViewingLiveResult ? liveLocation?.osmUrl : undefined}
          addedToHome={addedToHome}
          onAddToHome={
            infoSlider
              ? () => {
                  requestAddToHomeGrid(infoSlider.content);
                  setAddedToHome(true);
                }
              : undefined
          }
        />
      </div>

    </SelectPostItLayer>
  );
}
export default Map;

function RenderLocation({ displayLocation, locations }: { displayLocation: string, locations: MapLocation[] }) {
  const location = locations.find(loca => loca.name === displayLocation)

  if (!location) return null;

  return (
    <Polyline
      pathOptions={{ color: location.color, opacity: 0.5 }}
      positions={location.bonds}
    />
  );
}

function FlyTo({ lat, lng, zoom = 15 }: { lat: number, lng: number, zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
}

