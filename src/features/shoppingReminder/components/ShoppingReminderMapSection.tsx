"use client";

import dynamic from "next/dynamic";

import { Location } from "@/features/shoppingReminder/hooks/useLocation";
import { Reminder } from "@/features/shoppingReminder/components/shoppingReminderAppTypes";
import { formatCoordinate } from "@/features/shoppingReminder/components/shoppingReminderAppUtils";

const CurrentLocationMap = dynamic(
  () =>
    import("@/features/shoppingReminder/components/CurrentLocationMap").then(
      (module) => module.CurrentLocationMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] w-full items-center justify-center rounded-[22px] border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500 sm:h-[360px]">
        地図を読み込んでいます...
      </div>
    ),
  }
);

type MapSectionProps = {
  location: Location | null;
  reminders: Reminder[];
  selectedDraftLocation: Location | null;
  onSelectLocation: (location: Location) => void;
};

export function MapSection({
  location,
  reminders,
  selectedDraftLocation,
  onSelectLocation,
}: MapSectionProps) {
  return (
    <section className="order-1 rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(120,96,72,0.10)] backdrop-blur sm:rounded-[28px] sm:p-8 lg:order-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-500">現在地マップ</p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-900">
            いまいる場所を地図で確認
          </h2>
        </div>
        <p className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
          {location ? "GPS ON" : "GPS WAIT"}
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:mt-6">
        <CurrentLocationMap
          location={location}
          reminders={reminders}
          selectedLocation={selectedDraftLocation}
          onSelectLocation={onSelectLocation}
        />
        <p className="text-sm leading-6 text-stone-500">
          {selectedDraftLocation
            ? `地図で選択中の地点: ${formatCoordinate(selectedDraftLocation.lat)}, ${formatCoordinate(selectedDraftLocation.lng)}`
            : "地図をタップすると、新しい TODO の場所候補を選べます。登録済み TODO はマーカーで表示されます。"}
        </p>
      </div>
    </section>
  );
}
