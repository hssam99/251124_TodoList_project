"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MakeTodoButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // body 없이 POST → API에서 자동으로 오늘 날짜 보드 생성
      const res = await fetch("/api/todo_boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // 아예 안 보내도 되는데 타입 맞추려면 이렇게
      });

      if (!res.ok) {
        console.error("보드 생성 실패");
        return;
      }

      const data = await res.json();
      const newBoardId = data.id;

      // ✅ 새로 생성된 보드 상세 페이지로 이동
      // 너가 만든 라우트에 맞게 수정 (예: /todo/${id} 또는 /board/${id})
      router.push(`/todo/${newBoardId}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="makeTodoBtn btn"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "만드는 중..." : "새로운 투두리스트 만들기 +"}
    </button>
  );
}