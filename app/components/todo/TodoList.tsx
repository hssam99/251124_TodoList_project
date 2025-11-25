// 클라이언트 컴포넌트
"use client";

import { BoardType } from "@/app/type/boardType";
import { TodoType } from "@/app/type/todoType";
import TodoListRow from "./TodoListRow";
import TodoItemInput from "./TodoItemInput";
import { useEffect, useState } from "react";
import axios from "axios";
import TodoCardHeader from "./TodoCardHeader";
import TodoListHeader from "./TodoListHeader";


type TodoListProps = {
    board: BoardType;
    todos: TodoType[];
};

type SortType = "default" | "important" | "due_date";
type FilterType = "TODO_COLORS_0" | "TODO_COLORS_1" | "TODO_COLORS_2" | "TODO_COLORS_3" | "TODO_COLORS_4" | "TODO_COLORS_5" | "important" | "in_progress" | "d_day";


export default function TodoList({ board, todos: initialTodos }: TodoListProps) {
    // 내부에서 실제로 관리할 todos (initialTodos로 초기화) > 새로고침 안해도 반영 가능
    const [todos, setTodos] = useState<TodoType[]>(initialTodos);
    const [sortType, setSortType] = useState<SortType>("default");
    const [filterSet, setFilterSet] = useState<Set<FilterType>>(new Set());

    // API GET + axios
    const fetchTodos = async (): Promise<void> => {
        try {
            const filters = Array.from(filterSet);

            const res = await axios.get<TodoType[]>("/api/todo_items", {
                params: {
                    board_id: board.id,
                    sort: sortType,
                    filter: filters,
                },
            });
            setTodos(res.data);
        } catch (error) {
            console.error("todo 목록 불러오기 실패:", error);
        }
    };

    // 최신 데이터로 동기화 (새로고침 X)
    // board.id(다른 투두리스트 보드로 넘어갈때 안전하게 데이터 가져옴) 또는 sortType이 변경될 때마다 실행
    useEffect(() => {
        fetchTodos();
    }, [board.id, sortType, filterSet]);

    return (
        <div className="todo-page">
            <div className="todo-card">
                {/* 상단 카드 헤더 */}
                <TodoCardHeader board={board} todos={todos} onUpdated={fetchTodos} />

                {/* 새 투두 입력 (POST 연결) */}
                <TodoItemInput boardId={board.id} onCreated={fetchTodos} />

                {/* 목록 헤더 (정렬  > GET(ORDER BY) / 클리어 > DELETE / 필터 > GET(WHERE))*/}
                {/* 필터 종류 / 정렬 종류는 부모 컴포넌트에서 관리 > 로직만 TodoListHeader 컴포넌트에서 관리 */}
                <TodoListHeader
                    onUpdated={fetchTodos}
                    sortType={sortType}
                    setSortType={setSortType}
                    filterSet={filterSet}
                    setFilterSet={setFilterSet}
                />

                {/* 투두 목록 (DELETE / PATCH 연결) */}
                <section className="todo-list-section">
                    {todos.length === 0 ? (
                        <p className="todo-empty-text">
                            아직 등록된 할 일이 없어요. 첫 할 일을 추가해보세요 ✏️
                        </p>
                    ) : (
                        <ul className="todo-list">
                            {todos.map((todo) => (
                                <TodoListRow key={todo.id} todo={todo} onUpdated={fetchTodos} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div >
    );
}
