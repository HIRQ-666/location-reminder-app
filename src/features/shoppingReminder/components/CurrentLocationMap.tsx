"use client";

import { useEffect } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { Location } from "@/features/shoppingReminder/hooks/useLocation";

export type ReminderMapItem = {
  id: number;
  title: string;
  placeName: string;
  radiusMeters: number;
  target: Location;
};

type CurrentLocationMapProps = {
  location: Location | null;
  reminders: ReminderMapItem[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location) => void;
};

const DEFAULT_CENTER: [number, number] = [35.681236, 139.767125];

function RecenterMap({ location }: Pick<CurrentLocationMapProps, "location">) {
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

function MapTapHandler({
  onSelectLocation,
}: Pick<CurrentLocationMapProps, "onSelectLocation">) {
  useMapEvents({
    click(event) {
      onSelectLocation({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

export function CurrentLocationMap({
  location,
  reminders,
  selectedLocation,
  onSelectLocation,
}: CurrentLocationMapProps) {
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
        <MapTapHandler onSelectLocation={onSelectLocation} />

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

        {reminders.map((reminder) => (
          <Marker
            key={reminder.id}
            position={[reminder.target.lat, reminder.target.lng]}
          >
            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{reminder.title}</p>
                <p className="text-xs text-stone-600">{reminder.placeName}</p>
                <p className="text-xs text-stone-600">
                  判定半径: {reminder.radiusMeters}m
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {selectedLocation ? (
          <CircleMarker
            center={[selectedLocation.lat, selectedLocation.lng]}
            pathOptions={{
              color: "#0369a1",
              fillColor: "#38bdf8",
              fillOpacity: 0.95,
              weight: 3,
            }}
            radius={9}
          />
        ) : null}
      </MapContainer>
    </div>
  );
}
