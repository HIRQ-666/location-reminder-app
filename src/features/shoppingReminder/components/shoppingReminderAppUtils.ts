import { Location } from "@/features/shoppingReminder/hooks/useLocation";

import { ReminderDraft } from "@/features/shoppingReminder/components/shoppingReminderAppTypes";

export const formatCoordinate = (value: number) => value.toFixed(6);

export const formatDistance = (distanceMeters: number) => {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  }

  return `${(distanceMeters / 1000).toFixed(2)}km`;
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const calculateDistanceMeters = (from: Location, to: Location) => {
  const earthRadius = 6_371_000;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLng / 2) ** 2;

  return 2 * earthRadius * Math.asin(Math.sqrt(haversine));
};

export const parseDraftLocation = (draft: ReminderDraft): Location | null => {
  const lat = Number(draft.targetLat);
  const lng = Number(draft.targetLng);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return { lat, lng };
};
