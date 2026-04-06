"use client";

import { ChangeEvent, FormEvent, RefObject } from "react";

import { ReminderDraft } from "@/features/shoppingReminder/components/shoppingReminderAppTypes";

type ReminderFormSectionProps = {
  draft: ReminderDraft;
  formRef: RefObject<HTMLFormElement | null>;
  hasCurrentLocation: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUseCurrentLocation: () => void;
};

export function ReminderFormSection({
  draft,
  formRef,
  hasCurrentLocation,
  onChange,
  onSubmit,
  onUseCurrentLocation,
}: ReminderFormSectionProps) {
  return (
    <form
      className="order-3 rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(120,96,72,0.10)] backdrop-blur sm:rounded-[28px] sm:p-8 lg:order-1"
      onSubmit={onSubmit}
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
          onClick={onUseCurrentLocation}
          type="button"
          disabled={!hasCurrentLocation}
        >
          現在地を使う
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">やること</span>
          <input
            className="min-h-13 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
            name="title"
            onChange={onChange}
            placeholder="例: 洗剤を買う"
            value={draft.title}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">場所名</span>
          <input
            className="min-h-13 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
            name="placeName"
            onChange={onChange}
            placeholder="例: ドラッグストア"
            value={draft.placeName}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 sm:col-span-1">
            <span className="text-sm font-medium text-stone-700">半径(m)</span>
            <input
              className="min-h-13 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
              name="radiusMeters"
              onChange={onChange}
              type="number"
              min="1"
              value={draft.radiusMeters}
            />
          </label>

          <label className="grid gap-2 sm:col-span-1">
            <span className="text-sm font-medium text-stone-700">緯度</span>
            <input
              className="min-h-13 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
              name="targetLat"
              onChange={onChange}
              placeholder="35.681236"
              value={draft.targetLat}
            />
          </label>

          <label className="grid gap-2 sm:col-span-1">
            <span className="text-sm font-medium text-stone-700">経度</span>
            <input
              className="min-h-13 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
              name="targetLng"
              onChange={onChange}
              placeholder="139.767125"
              value={draft.targetLng}
            />
          </label>
        </div>

        <p className="rounded-2xl bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
          地図をタップすると、緯度と経度にその地点が自動入力されます。既存の TODO は地図上のマーカーから確認できます。
        </p>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">メモ</span>
          <textarea
            className="min-h-32 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base outline-none transition focus:border-orange-500"
            name="notes"
            onChange={onChange}
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
  );
}
