"use client"
import useOutsideClick from "@/app/hooks/useOutsideClick";
import { TODO_COLORS } from "@/lib/constants/todo";
import axios from "axios";
import { useEffect, useState } from "react";

type TodoColor = (typeof TODO_COLORS)[number];
type TodoForm = {
    name: string;
    due_date: string;
    due_time: string;
    is_done: boolean;
    color: TodoColor;
    is_important: boolean;
};

type TodoItemInputProps = {
  boardId: number;
  onCreated?: () => void;
};


export default function TodoItemInput({ boardId, onCreated }: TodoItemInputProps) {
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);

    const moreRef = useOutsideClick<HTMLDivElement>(() => {
        setIsPaletteOpen(false);
    });

    // 폼 상태는 “사용자가 입력하는 값”만 들어가는 게 좋다. (boardId는 이미 props로 받고 있으니까)
    const [form, setForm] = useState<TodoForm>({
        name: "",
        due_date: "",
        due_time: "",
        is_done: false,
        color: TODO_COLORS[0],
        is_important: false,
    })

    // 디버깅용 콘솔 (return 안에서는 사용이 불가능, jsx여서)
    // useEffect(() => {
    //     console.log("form 상태:", form);
    // }, [form]);

    // input 값 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // 디비 반영 (1. 엔터키 2. 추가버튼 클릭)
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("할일을 입력하세요.")
            return;
        }

        try {
            // 필수값은 name(할일)만
            const res = await axios.post("/api/todo_items", {
                board_id: boardId,
                name: form.name,
                due_date: form.due_date || null,
                due_time: form.due_time || null,
                is_done: form.is_done,
                color: form.color,
                is_important: form.is_important,
            });

            // 폼 초기화
            setForm({
                name: "",
                due_date: "",
                due_time: "",
                is_done: false,
                color: TODO_COLORS[0],
                is_important: false,
            });

            // 페이지 새로고침
            onCreated?.();
        } catch (error) {
            console.log(error);
            alert("에러가 발생했습니다. 새로고침 해주세요.");
        }
    };

    return (
        <form className="todo-input-section" onSubmit={handleSubmit}>
            {/* 색상 선택 */}
            <div className="color-picker" ref={moreRef}>
                <button
                    type="button"
                    className="color-dot color-toggle"
                    style={{ backgroundColor: form.color }}
                    onClick={() => setIsPaletteOpen((prev) => !prev)}
                />

                {/* 팔레트: 목록 보기 */}
                {isPaletteOpen && (
                    <div className="isOpen isOpen-color-list">
                        {TODO_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className={`
                                    color-dot
                                    ${color === "transparent" ? "no-color" : ""}
                                    ${form.color === color ? "selected" : ""}
                                `}
                                style={{
                                    backgroundColor: color === "transparent" ? "transparent" : color
                                }}
                                onClick={() => {
                                    setForm((prev) => ({ ...prev, color }));
                                    setIsPaletteOpen(false);
                                }}
                            >
                                {/* transparent 전용 SVG 표시 */}
                                {color === "transparent" && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="10"
                                        height="10"
                                        fill="currentColor"
                                        className="bi bi-x-lg"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                    </svg>
                                )}
                            </button>
                        ))}

                    </div>
                )}
            </div>

            {/* 할 일 입력 */}
            <input
                name="name"
                type="text"
                className="todo-input name-input"
                placeholder="오늘 할 일을 입력해 보세요"
                value={form.name}
                onChange={handleChange}
            />
            {/* 시간 입력 */}
            <input
                name="due_time"
                type="time"
                className="todo-input due-time-input"
                value={form.due_time}
                onChange={handleChange}
            />

            {/* 마감일 입력 */}
            <input
                name="due_date"
                type="date"
                className="todo-input due-date-input"
                value={form.due_date}
                onChange={handleChange}
            />

            {/* 중요도 표시 */}
            <button
                type="button"
                className={`todo-input is-important-input ${form.is_important ? "important" : ""}`}
                onClick={() =>
                    setForm((prev) => ({
                        ...prev,
                        is_important: !prev.is_important
                    }))
                }
            >
                {form.is_important ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                    </svg>

                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                    </svg>
                )}
            </button>

            {/* 추가 버튼 */}
            <button className="todo-input-submitBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                </svg>
            </button>
        </form>
    );
}