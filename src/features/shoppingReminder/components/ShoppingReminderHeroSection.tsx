"use client";

import { Location } from "@/features/shoppingReminder/hooks/useLocation";
import { formatCoordinate } from "@/features/shoppingReminder/components/shoppingReminderAppUtils";

type StatusCardProps = {
  error: string | null;
  isLocating: boolean;
  location: Location | null;
};

type HeroSectionProps = StatusCardProps;

function StatusCard({ error, isLocating, location }: StatusCardProps) {
  return (
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
        <p>緯度: {location ? formatCoordinate(location.lat) : "まだ未取得"}</p>
        <p>経度: {location ? formatCoordinate(location.lng) : "まだ未取得"}</p>
      </div>

      {error ? (
        <p className="rounded-2xl bg-red-500/12 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function HeroSection({ error, isLocating, location }: HeroSectionProps) {
  return (
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
            現在地を監視しながら、場所にひもづく買い物メモを登録できる MVP
            です。まずはブラウザだけで流れを固めて、あとから通知や保存を足せる形にしています。
          </p>
        </div>

        <StatusCard error={error} isLocating={isLocating} location={location} />
      </div>
    </section>
  );
}
