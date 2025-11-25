// 할일 이름 / 중요도 / 진행중 표시 및 수정 컴포넌트
// TodoRowMain.tsx

import { use, useState } from "react";
import { TodoType } from "@/app/type/todoType";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import { TODO_COLORS } from "@/lib/constants/todo";

// 타입 정의
type TodoRowMainProps = {
  todo: TodoType;
  onUpdate: (patch: Partial<TodoType>) => void;
};

export default function TodoRowMain({ todo, onUpdate }: TodoRowMainProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(todo.name);
  const [editImportant, setEditImportant] = useState(todo.is_important);
  const [editInProgress, setEditInProgress] = useState(todo.is_in_progress);
  const [editDueDate, setEditDueDate] = useState<string>(todo.due_date ?? "");
  const [editDueTime, setEditDueTime] = useState<string>(
    todo.due_time ? String(todo.due_time).slice(0, 5) : ""
  );
  const [editColor, setEditColor] = useState<TodoType["color"]>(todo.color);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const startEdit = () => {
    setIsEditing(true);
    setEditName(todo.name);
    setEditImportant(todo.is_important);
    setEditInProgress(todo.is_in_progress);
    setEditDueDate(todo.due_date ?? "");
    setEditDueTime(
      todo.due_time ? String(todo.due_time).slice(0, 5) : ""
    );
    setEditColor(todo.color);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditName(todo.name);
    setEditImportant(todo.is_important);
    setEditInProgress(todo.is_in_progress);
    setEditDueDate(todo.due_date ?? "");
    setEditDueTime(
      todo.due_time ? String(todo.due_time).slice(0, 5) : ""
    );
    setEditColor(todo.color);
  };

  const saveEdit = () => {
    if (!editName.trim()) {
      alert("할 일을 입력해주세요.");
      return;
    }
    onUpdate({
      name: editName,
      is_important: editImportant,
      is_in_progress: editInProgress,
      due_date: editDueDate || null,
      due_time: editDueTime || null,
      color: editColor,
    });
    setIsEditing(false);
  };

  // 바깥 클릭 시 수정 완료 (save)
  const editRef = useOutsideClick<HTMLDivElement>(() => {
    if (isEditing) {
      saveEdit();
    }
  });

  // date로부터 D-day 라벨 생성
  function getDDayLabel(dueDateString: string) {
    const today = new Date();
    const dueDate = new Date(dueDateString);

    // 시간 영향 제거 (00:00 기준)
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { label: "D-day", type: "dday" };
    }
    if (diffDays > 0) {
      return { label: `D-${diffDays}`, type: "future" };
    }
    return { label: `D+${Math.abs(diffDays)}`, type: "past" };
  }


  return (
    <div className="todo-item-main">
      {/* isEditing - 수정버전 */}
      {isEditing ?
        (
          <div ref={editRef} className="todo-edit-area">
            {/* color picker */}
            {/* 색상 선택 */}
            <div className="color-picker" >
              <button
                type="button"
                className="color-dot color-toggle"
                style={{ backgroundColor: editColor }}
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
                        ${editColor === color ? "selected" : ""}
                      `}
                      style={{
                        backgroundColor: color === "transparent" ? "transparent" : color
                      }}
                      onClick={() => {
                        setEditColor(color);
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
            {/* 태그 (중요 / 진행중) */}
            <div className="todo-edit-tags-area">
              <button
                type="button"
                className={`todo-tag todo-in-progress-tag ${editInProgress ? "active" : ""
                  }`}
                onClick={() => setEditInProgress((prev) => !prev)}
              >
                진행중
              </button>
              <button
                type="button"
                className={`todo-tag todo-important-tag ${editImportant ? "active" : ""
                  }`}
                onClick={() => setEditImportant((prev) => !prev)}
              >
                중요
              </button>
            </div>

            {/* 할일 input */}
            <input
              className="todo-item-name-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
            />
            {/* 날짜 / 시간 input */}
            <div className="todo-edit-due">
              <input
                type="date"
                className="todo-edit-due-date-input"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
              <input
                type="time"
                className="todo-edit-due-time-input"
                value={editDueTime}
                onChange={(e) => setEditDueTime(e.target.value)}
              />
            </div>
          </div>
        ) : (
          // !isEditing - 기본버전
          <>
            <div className="todo-item-main-container">
              {!!todo.is_in_progress && (
                <span className="todo-in-progress-tag active todo-tag" onClick={startEdit}>진행중</span>
              )}
              {!!todo.is_important && (
                <span className="todo-important-tag active todo-tag" onClick={startEdit}>중요</span>
              )}
              <span className="todo-item-name" onClick={startEdit}>
                {todo.name}
              </span>

            </div>
            <div className="todo-item-due-container" onClick={startEdit}>
              <span>
                {todo.due_time && (
                  <span className="todo-item-due">
                    {String(todo.due_time).slice(0, 5)}
                  </span>
                )}
              </span>
              <span className="dday-tag-area">
                {todo.due_date && (() => {
                  const { label, type } = getDDayLabel(String(todo.due_date));
                  return (
                    <span className={`dday-tag dday-${type}`}>
                      {label}
                    </span>
                  );
                })()}
              </span>
            </div>
          </>
        )}
    </div>
  );
}
