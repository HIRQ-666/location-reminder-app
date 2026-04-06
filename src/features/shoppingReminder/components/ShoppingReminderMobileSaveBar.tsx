"use client";

import { RefObject } from "react";

type MobileSaveBarProps = {
  formRef: RefObject<HTMLFormElement | null>;
};

export function MobileSaveBar({ formRef }: MobileSaveBarProps) {
  return (
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
  );
}
