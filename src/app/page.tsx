"use client";

import { useLocation } from "@/features/shoppingReminder/hooks/useLocation";

export default function Home() {
  const { location, error } = useLocation();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Location Reminder App</h1>

      {!location && !error && <p>位置情報を取得中です...</p>}

      {error && <p className="text-red-600">エラー: {error}</p>}

      {location && (
        <div className="space-y-2">
          <p>緯度: {location.lat}</p>
          <p>経度: {location.lng}</p>
        </div>
      )}
    </main>
  );
}