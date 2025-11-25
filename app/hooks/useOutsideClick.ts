// 팝업 후 다른 공간 클릭시 사라지게 하는 훅
"use client";

import { useEffect, useRef } from "react";

export default function useOutsideClick<T extends HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback(); // 바깥 클릭 시 실행
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);

  return ref;
}
