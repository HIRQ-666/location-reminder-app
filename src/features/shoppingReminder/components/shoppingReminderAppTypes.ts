import { Location } from "@/features/shoppingReminder/hooks/useLocation";

export type ReminderDraft = {
  title: string;
  placeName: string;
  radiusMeters: string;
  targetLat: string;
  targetLng: string;
  notes: string;
};

export type Reminder = {
  id: number;
  title: string;
  placeName: string;
  radiusMeters: number;
  target: Location;
  notes: string;
};

export type ReminderCard = Reminder & {
  distanceMeters: number | null;
  isNearby: boolean;
};

export const INITIAL_DRAFT: ReminderDraft = {
  title: "",
  placeName: "",
  radiusMeters: "150",
  targetLat: "",
  targetLng: "",
  notes: "",
};

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 1,
    title: "牛乳を買う",
    placeName: "近所のスーパー",
    radiusMeters: 180,
    target: {
      lat: 35.681236,
      lng: 139.767125,
    },
    notes: "特売ならヨーグルトも確認",
  },
];
