"use client";

import { useState, useRef, KeyboardEvent } from "react";
import axios from "axios";
import { BoardType } from "@/app/type/boardType";
import { TodoType } from "@/app/type/todoType";
import formatDateYYYYMMDD from "@/lib/utils/utils";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import { useRouter as userRouter } from "next/navigation";

type TodoCardHeaderProps = {
    board: BoardType;
    todos: TodoType[];
    // 리스트 전체를 최신 상태로 유지하기 위한 콜백 함수
    // window.location.reload() 대신 사용
    onUpdated?: () => void;
};

export default function TodoCardHeader({ board, todos, onUpdated, }: TodoCardHeaderProps) {
    const router = userRouter();
    const totalTasks = todos.length;

    // === EDIT MODE ===
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(board.title);
    const [editDate, setEditDate] = useState<string>(formatDateYYYYMMDD(board.board_date));
    const [isSaving, setIsSaving] = useState(false);
    const titleInputRef = useRef<HTMLInputElement | null>(null);

    const [currentTitle, setCurrentTitle] = useState(board.title);
    const [currentDate, setCurrentDate] = useState(board.board_date ? formatDateYYYYMMDD(board.board_date) : "");

    // 바깥 클릭 시 수정 완료 (save)
    const wrapperRef = useOutsideClick<HTMLDivElement>(() => {
        if (isEditing) {
            handleSave();
        }
    });

    const startEdit = () => {
        setIsEditing(true);
        setEditTitle(currentTitle);
        setEditDate(currentDate);
        setTimeout(() => {
            titleInputRef.current?.focus();
            titleInputRef.current?.select();
        }, 0);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditTitle(currentTitle);
        setEditDate(currentDate);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            e.preventDefault();
            cancelEdit();
        }
    };

    const handleSave = async () => {
        if (!editTitle.trim()) {
            alert("제목은 비워둘 수 없습니다.");
            return;
        }
        if (!isEditing || isSaving) return;

        if (editTitle === board.title && editDate === formatDateYYYYMMDD(board.board_date)) {
            setIsEditing(false);
            return;
        }
        try {
            setIsSaving(true);
            const res = await axios.patch(`/api/todo_boards/${board.id}`, { title: editTitle, board_date: editDate || null, });
            console.log("PATCH 성공:", res.data);
            setCurrentTitle(editTitle);
            setCurrentDate(editDate);
            setIsEditing(false);
            onUpdated?.();
        } catch (error: any) {
            console.error("보드 수정 중 오류:", error);
            alert("보드 수정 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };


    const handleDelete = async () => {
        if (!confirm("투두리스트를 삭제할까요?\n할일을 비우려면 필터버튼 옆 청소하기 아이콘을 클릭해주세요.")) return;

        try {
            setIsSaving(true);
            await axios.delete(`/api/todo_boards/${board.id}`);
            console.log("✅ 보드 삭제 완료");
            router.push(`/`);
        } catch (error) {
            console.error("보드 삭제 중 오류:", error);
            alert("보드 삭제 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div ref={wrapperRef}>
            <header className="todo-card-header">
                <div className="todo-card-header-left">
                    <div className="todo-card-header-titleinfo todo-card-header-left"
                        onClick={() => {
                            if (!isEditing) startEdit();
                        }}
                    >
                        {/* 보기 모드 */}
                        {!isEditing && (
                            <>
                                <div className="todo-card-date">
                                    {currentDate || "날짜 없음"}
                                </div>
                                <div>
                                    <h2 className="todo-card-title">{currentTitle}</h2>
                                </div>
                            </>
                        )}

                        {/* 수정 모드 */}
                        {isEditing && (
                            <>
                                <input
                                    type="date"
                                    className="todo-card-date todo-card-date-input"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <input
                                    ref={titleInputRef}
                                    type="text"
                                    className="todo-card-title todo-card-title-input"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="투두리스트 제목"
                                />
                            </>
                        )}

                    </div>
                    <button className="todo-card-count">{totalTasks} tasks</button>
                </div>

                <div className="todo-card-header-right">
                    <div className="todo-card-header-icons todo-card-header-icons-memo" aria-label="메모아이콘">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sticky-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zm6 8.5a1 1 0 0 1 1-1h4.396a.25.25 0 0 1 .177.427l-5.146 5.146a.25.25 0 0 1-.427-.177z" />
                        </svg>
                    </div>
                    <button
                        className="todo-card-header-icons"
                        onClick={handleDelete}
                        disabled={isSaving}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash3-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                    </button>
                </div>
            </header>
        </div>
    );
}