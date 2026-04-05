"use client";

import { useEffect } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import { Location } from "@/features/shoppingReminder/hooks/useLocation";

type CurrentLocationMapProps = {
  location: Location | null;
};

const DEFAULT_CENTER: [number, number] = [35.681236, 139.767125];

function RecenterMap({ location }: CurrentLocationMapProps) {
  const map = useMap();

  useEffect(() => {
    if (!location) {
      return;
    }

    map.flyTo([location.lat, location.lng], Math.max(map.getZoom(), 16), {
      duration: 0.8,
    });
  }, [location, map]);

  return null;
}

export function CurrentLocationMap({ location }: CurrentLocationMapProps) {
  const center: [number, number] = location
    ? [location.lat, location.lng]
    : DEFAULT_CENTER;

  return (
    <div className="overflow-hidden rounded-[22px] border border-stone-200 bg-stone-100">
      <MapContainer
        center={center}
        className="h-[280px] w-full sm:h-[360px]"
        scrollWheelZoom={false}
        zoom={location ? 16 : 13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap location={location} />

        {location ? (
          <>
            <Circle
              center={[location.lat, location.lng]}
              pathOptions={{
                color: "#f97316",
                fillColor: "#fdba74",
                fillOpacity: 0.2,
                weight: 2,
              }}
              radius={120}
            />
            <CircleMarker
              center={[location.lat, location.lng]}
              pathOptions={{
                color: "#9a3412",
                fillColor: "#f97316",
                fillOpacity: 1,
                weight: 3,
              }}
              radius={10}
            />
          </>
        ) : null}
      </MapContainer>
    </div>
  );
}
