"use client";

import { useEffect, useState } from "react";

export type Location = {
  lat: number;
  lng: number;
};

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("このブラウザは位置情報の取得に対応していません。");
      setIsLocating(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
        setIsLocating(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("位置情報の利用が許可されていません。ブラウザ設定を確認してください。");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("位置情報を取得できませんでした。電波状況や端末設定をご確認ください。");
            break;
          case err.TIMEOUT:
            setError("位置情報の取得がタイムアウトしました。");
            break;
          default:
            setError("位置情報の取得中に不明なエラーが発生しました。");
            break;
        }

        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error, isLocating };
};
