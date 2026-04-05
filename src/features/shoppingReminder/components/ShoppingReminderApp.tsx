"use client";

import dynamic from "next/dynamic";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";

import { Location, useLocation } from "@/features/shoppingReminder/hooks/useLocation";

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

type ReminderDraft = {
  title: string;
  placeName: string;
  radiusMeters: string;
  targetLat: string;
  targetLng: string;
  notes: string;
};

type Reminder = {
  id: number;
  title: string;
  placeName: string;
  radiusMeters: number;
  target: Location;
  notes: string;
};

const INITIAL_DRAFT: ReminderDraft = {
  title: "",
  placeName: "",
  radiusMeters: "150",
  targetLat: "",
  targetLng: "",
  notes: "",
};

const INITIAL_REMINDERS: Reminder[] = [
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

const formatCoordinate = (value: number) => value.toFixed(6);

const formatDistance = (distanceMeters: number) => {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  }

  return `${(distanceMeters / 1000).toFixed(2)}km`;
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const calculateDistanceMeters = (from: Location, to: Location) => {
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

const parseDraftLocation = (draft: ReminderDraft): Location | null => {
  const lat = Number(draft.targetLat);
  const lng = Number(draft.targetLng);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return { lat, lng };
};

export function ShoppingReminderApp() {
  const { location, error, isLocating } = useLocation();
  const [draft, setDraft] = useState<ReminderDraft>(INITIAL_DRAFT);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const formRef = useRef<HTMLFormElement>(null);

  const reminderCards = useMemo(
    () =>
      reminders.map((reminder) => {
        const distanceMeters = location
          ? calculateDistanceMeters(location, reminder.target)
          : null;
        const isNearby =
          distanceMeters !== null && distanceMeters <= reminder.radiusMeters;

        return {
          ...reminder,
          distanceMeters,
          isNearby,
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
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(120,96,72,0.12)] backdrop-blur sm:rounded-[32px] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-600 sm:text-sm">
                Location Based Todo
              </p>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
                お店の近くに来たら、
                <br />
                買い忘れを思い出せるようにする
              </h1>
              <p className="max-w-xl text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">
                現在地を監視しながら、場所にひもづく買い物メモを登録できる
                MVP です。まずはブラウザだけで流れを固めて、あとから通知や保存を足せる形にしています。
              </p>
            </div>

            <div className="grid gap-3 rounded-[22px] bg-stone-950 p-4 text-white sm:min-w-[320px] sm:rounded-[24px]">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                  Current Status
                </p>
                <p className="mt-2 text-lg font-medium">
                  {error
                    ? "位置情報を取得できません"
                    : location
                      ? "位置情報を取得できています"
                      : isLocating
                        ? "位置情報の許可を待っています"
                        : "位置情報の待機中"}
                </p>
              </div>

              <div className="grid gap-1 text-sm text-stone-300">
                <p>
                  緯度:{" "}
                  {location ? formatCoordinate(location.lat) : "まだ未取得"}
                </p>
                <p>
                  経度:{" "}
                  {location ? formatCoordinate(location.lng) : "まだ未取得"}
                </p>
              </div>

              {error ? (
                <p className="rounded-2xl bg-red-500/12 px-3 py-2 text-sm text-red-200">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <section className="order-1 rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(120,96,72,0.10)] backdrop-blur sm:rounded-[28px] sm:p-8 lg:order-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-stone-500">
                  現在地マップ
                </p>
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
                onSelectLocation={handleSelectMapLocation}
              />
              <p className="text-sm leading-6 text-stone-500">
                {selectedDraftLocation
                  ? `地図で選択中の地点: ${formatCoordinate(selectedDraftLocation.lat)}, ${formatCoordinate(selectedDraftLocation.lng)}`
                  : "地図をタップすると、新しい TODO の場所候補を選べます。登録済み TODO はマーカーで表示されます。"}
              </p>
            </div>
          </section>

          <form
            className="order-3 rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(120,96,72,0.10)] backdrop-blur sm:rounded-[28px] sm:p-8 lg:order-1"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-500">
                  新しいリマインダー
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-stone-900">
                  場所つきの買い物メモを登録
                </h2>
              </div>

              <button
                className="min-h-12 w-full rounded-full border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-0 sm:w-auto sm:py-2"
                onClick={handleUseCurrentLocation}
                type="button"
                disabled={!location}
              >
                現在地を使う
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-700">
                  やること
                </span>
                <input
                  className="min-h-13 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
                  name="title"
                  onChange={handleChange}
                  placeholder="例: 洗剤を買う"
                  value={draft.title}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-700">
                  場所名
                </span>
                <input
                  className="min-h-13 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
                  name="placeName"
                  onChange={handleChange}
                  placeholder="例: ドラッグストア"
                  value={draft.placeName}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-sm font-medium text-stone-700">
                    半径(m)
                  </span>
                  <input
                    className="min-h-13 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
                    name="radiusMeters"
                    onChange={handleChange}
                    type="number"
                    min="1"
                    value={draft.radiusMeters}
                  />
                </label>

                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-sm font-medium text-stone-700">
                    緯度
                  </span>
                  <input
                    className="min-h-13 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
                    name="targetLat"
                    onChange={handleChange}
                    placeholder="35.681236"
                    value={draft.targetLat}
                  />
                </label>

                <label className="grid gap-2 sm:col-span-1">
                  <span className="text-sm font-medium text-stone-700">
                    経度
                  </span>
                  <input
                    className="min-h-13 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
                    name="targetLng"
                    onChange={handleChange}
                    placeholder="139.767125"
                    value={draft.targetLng}
                  />
                </label>
              </div>

              <p className="rounded-2xl bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
                地図をタップすると、緯度と経度にその地点が自動入力されます。既存の TODO は地図上のマーカーから確認できます。
              </p>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-700">
                  メモ
                </span>
                <textarea
                  className="min-h-32 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
                  name="notes"
                  onChange={handleChange}
                  placeholder="例: 詰め替え用を優先"
                  value={draft.notes}
                />
              </label>
            </div>

            <div className="mt-6 hidden items-center justify-between gap-4 sm:flex">
              <p className="text-sm leading-6 text-stone-500">
                今はブラウザ内の状態だけで動きます。あとから IndexedDB や通知 API
                をつなげやすい構成です。
              </p>

              <button
                className="rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                type="submit"
              >
                登録する
              </button>
            </div>
          </form>

          <section className="order-2 rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(120,96,72,0.10)] backdrop-blur sm:rounded-[28px] sm:p-8 lg:order-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-stone-500">
                  登録済みリマインダー
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-stone-900">
                  近い場所から確認
                </h2>
              </div>
              <p className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                {reminders.length} 件
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4">
              {reminderCards.map((reminder) => (
                <article
                  className="rounded-[20px] border border-stone-200 bg-stone-50 p-4 sm:rounded-[24px] sm:p-5"
                  key={reminder.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                        {reminder.placeName}
                      </p>
                      <h3 className="text-xl font-semibold text-stone-900">
                        {reminder.title}
                      </h3>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        reminder.isNearby
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {reminder.isNearby ? "到着圏内" : "まだ遠い"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-stone-600">
                    <p>判定半径: {reminder.radiusMeters}m</p>
                    <p>
                      目的地: {formatCoordinate(reminder.target.lat)},{" "}
                      {formatCoordinate(reminder.target.lng)}
                    </p>
                    <p>
                      現在地からの距離:{" "}
                      {reminder.distanceMeters === null
                        ? "位置情報を取得すると表示されます"
                        : formatDistance(reminder.distanceMeters)}
                    </p>
                    {reminder.notes ? <p>メモ: {reminder.notes}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200/80 bg-white/92 p-3 backdrop-blur sm:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Quick Save
              </p>
              <p className="truncate text-sm text-stone-700">
                入力が終わったらワンタップで登録
              </p>
            </div>

            <button
              className="min-h-12 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
              type="button"
              onClick={() => formRef.current?.requestSubmit()}
            >
              登録する
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
