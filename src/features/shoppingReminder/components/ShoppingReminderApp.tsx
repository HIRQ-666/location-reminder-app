"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";

import { Location, useLocation } from "@/features/shoppingReminder/hooks/useLocation";
import {
  HeroSection,
  MapSection,
  MobileSaveBar,
  ReminderFormSection,
  ReminderListSection,
} from "@/features/shoppingReminder/components/shoppingReminderAppSections";
import {
  INITIAL_DRAFT,
  INITIAL_REMINDERS,
  Reminder,
  ReminderCard,
  ReminderDraft,
} from "@/features/shoppingReminder/components/shoppingReminderAppTypes";
import {
  calculateDistanceMeters,
  parseDraftLocation,
} from "@/features/shoppingReminder/components/shoppingReminderAppUtils";

export function ShoppingReminderApp() {
  const { location, error, isLocating } = useLocation();
  const [draft, setDraft] = useState<ReminderDraft>(INITIAL_DRAFT);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const formRef = useRef<HTMLFormElement>(null);

  const reminderCards = useMemo<ReminderCard[]>(
    () =>
      reminders.map((reminder) => {
        const distanceMeters = location
          ? calculateDistanceMeters(location, reminder.target)
          : null;

        return {
          ...reminder,
          distanceMeters,
          isNearby:
            distanceMeters !== null && distanceMeters <= reminder.radiusMeters,
        };
      }),
    [location, reminders]
  );

  const selectedDraftLocation = useMemo(() => parseDraftLocation(draft), [draft]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setDraft((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUseCurrentLocation = () => {
    if (!location) {
      return;
    }

    setDraft((current) => ({
      ...current,
      targetLat: String(location.lat),
      targetLng: String(location.lng),
    }));
  };

  const handleSelectMapLocation = (nextLocation: Location) => {
    setDraft((current) => ({
      ...current,
      targetLat: nextLocation.lat.toFixed(6),
      targetLng: nextLocation.lng.toFixed(6),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = draft.title.trim();
    const placeName = draft.placeName.trim();
    const notes = draft.notes.trim();
    const radiusMeters = Number(draft.radiusMeters);
    const targetLat = Number(draft.targetLat);
    const targetLng = Number(draft.targetLng);

    if (!title || !placeName) {
      return;
    }

    if (
      Number.isNaN(radiusMeters) ||
      radiusMeters <= 0 ||
      Number.isNaN(targetLat) ||
      Number.isNaN(targetLng)
    ) {
      return;
    }

    setReminders((current) => [
      {
        id: Date.now(),
        title,
        placeName,
        radiusMeters,
        target: {
          lat: targetLat,
          lng: targetLng,
        },
        notes,
      },
      ...current,
    ]);

    setDraft(INITIAL_DRAFT);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7db_0%,_#fff2f2_42%,_#f7fbff_100%)] px-3 py-4 pb-28 text-stone-900 sm:px-6 sm:py-8 sm:pb-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6">
        <HeroSection error={error} isLocating={isLocating} location={location} />

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <MapSection
            location={location}
            reminders={reminders}
            selectedDraftLocation={selectedDraftLocation}
            onSelectLocation={handleSelectMapLocation}
          />
          <ReminderFormSection
            draft={draft}
            formRef={formRef}
            hasCurrentLocation={location !== null}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onUseCurrentLocation={handleUseCurrentLocation}
          />
          <ReminderListSection reminders={reminderCards} />
        </section>

        <MobileSaveBar formRef={formRef} />
      </div>
    </main>
  );
}
