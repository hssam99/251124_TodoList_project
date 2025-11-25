// 서버 컴포넌트

import { db } from "@/lib/db";
import { TodoType } from "@/app/type/todoType";
import { BoardType } from "@/app/type/boardType";
import TodoList from "@/app/components/todo/TodoList";


type TodoPageProps = {
    params: Promise<{ id: string }>;
}

export default async function TodoPage({ params }: TodoPageProps) {
    const { id } = await params;
    const boardId = Number(id);

    if (isNaN(boardId)) {
        throw new Error("보드 ID가 유효하지 않습니다.");
    }

    // page.tsx: 첫 진입 / 새로고침 시 SSR용 데이터 (초기 상태)
    // 해당 보드만 가져오기 (투두리스트 타이틀과 작성 날짜 가져오기 위해서)
    const [currentBoard] = await db.query(
        "SELECT * FROM todo_boards WHERE id = ?",
        [boardId]
    )
    const board = (currentBoard as BoardType[])[0];

    if (!board) {
        throw new Error("존재하지 않는 TO DO LIST 입니다.");
    }

    // 투두아이템 가져오기
    // 중요도 > due_date > due_time 순 가져옴
    const [todoItems] = await db.query(
        "SELECT * FROM todo_items WHERE board_id = ?",
        [boardId]
    );

    const todos = todoItems as TodoType[];
    console.log(todos);


    return (
        // 투두 페이지 컴포넌트
        <TodoList board={board} todos={todos} />
    );
}


