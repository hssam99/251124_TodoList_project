import useOutsideClick from "@/app/hooks/useOutsideClick";
import { TodoType } from "@/app/type/todoType";
import axios from "axios";
import { useState } from "react";
import TodoRowMain from "./TodoRowMain";

type TodoListRowProps = {
    todo: TodoType;
    // 리스트 전체를 최신 상태로 유지하기 위한 콜백 함수
    // window.location.reload() 대신 사용
    onUpdated?: () => void;
};

export default function TodoListRow({ todo, onUpdated }: TodoListRowProps) {
    const [isMoreOpen, setIsMoreOpen] = useState(false);


    // 바깥을 클릭하면 setIsMoreOpen 값 false로 변경
    const moreRef = useOutsideClick<HTMLDivElement>(() => {
        setIsMoreOpen(false);
    });


    // [삭제] DELETE API 연결
    async function deleteTodo() {
        try {
            const res = await axios.delete(`/api/todo_items/${todo.id}`);
            console.log("✅ 할일 삭제 완료");
            onUpdated?.();
        } catch (error) {
            console.error("할일 삭제 중 오류:", error);
        }
    }

    // [수정] PATCH API 연결 - 공통 PATCH
    const updateTodo = async (data: Partial<TodoType>) => {
        try {
            const payload: TodoType = {
                ...todo,
                ...data,
            };

            await axios.patch(`/api/todo_items/${todo.id}`, payload);
            console.log("✅ todo 수정 완료:", payload);

            onUpdated?.();
        } catch (error) {
            console.error("todo 수정 중 오류:", error);
        }
    };

    // is_done 수정
    const modifyIsDone = () => {
        updateTodo({
            is_done: !todo.is_done,
        });
    };

    // 복제하기 POST API 연결
    const duplicateTodo = async () => {
        try {
            await axios.post("/api/todo_items", {
                source_id: todo.id,
            });
            onUpdated?.();
        } catch (error) {
            console.error("복제 실패:", error);
        }
    };

    return (
        <div className="todo-list-row">
            <li
                key={todo.id}
                className={`
                    todo-item-row
                    ${todo.is_done ? "todo-done" : ""}
                    ${todo.is_important ? "todo-important" : ""}
                `}
                // 왼쪽 컬러 바 (없으면 기본 투명)
                style={{ borderLeftColor: todo.color || "transparent" }}
            >
                {/* is_done 동그라미 */}
                <button
                    onClick={modifyIsDone}
                    className={`todo-status-circle ${todo.is_done ? "checked" : ""}`}>
                    {todo.is_done ? (
                        // 체크된 동그라미
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                    ) : (
                        // 기본 동그라미
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 16 16"
                        >
                            <circle cx="8" cy="8" r="6" />
                        </svg>
                    )}
                </button>

                {/* is_important + is_in_progress + name + due_date + due_time */}
                <TodoRowMain todo={todo} onUpdate={updateTodo} />

                {/* 더보기 버튼 */}
                <div className="todo-item-right" ref={moreRef}>
                    <button
                        className="todo-item-more-btn"
                        onClick={() => setIsMoreOpen((prev) => !prev)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        </svg>
                        {/* 메뉴: 목록 보기 */}
                        {isMoreOpen && (
                            <div className="isOpen isOpen-more-list-left">
                                <div
                                    className="isOpen-more-Btn" onClick={duplicateTodo}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                        <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                                    </svg>
                                    복제하기
                                </div>
                                <div
                                    className="isOpen-more-Btn"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16">
                                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z" />
                                    </svg>
                                    공유하기
                                </div>
                                <div
                                    className="isOpen-more-Btn" onClick={deleteTodo}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                    </svg>
                                    삭제하기
                                </div>
                            </div>
                        )}
                    </button>
                </div>
            </li>
        </div>
    );
}

