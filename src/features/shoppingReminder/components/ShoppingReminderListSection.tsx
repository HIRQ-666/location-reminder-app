"use client";

import { ReminderCard } from "@/features/shoppingReminder/components/shoppingReminderAppTypes";
import {
  formatCoordinate,
  formatDistance,
} from "@/features/shoppingReminder/components/shoppingReminderAppUtils";

type ReminderListSectionProps = {
  reminders: ReminderCard[];
};

export function ReminderListSection({ reminders }: ReminderListSectionProps) {
  return (
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
        {reminders.map((reminder) => (
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
                目的地: {formatCoordinate(reminder.target.lat)}, {formatCoordinate(reminder.target.lng)}
              </p>
              <p>
                現在地からの距離: {reminder.distanceMeters === null
                  ? "位置情報を取得すると表示されます"
                  : formatDistance(reminder.distanceMeters)}
              </p>
              {reminder.notes ? <p>メモ: {reminder.notes}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
