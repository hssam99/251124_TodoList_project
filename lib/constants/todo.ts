// lib/constants/todo.ts
// as const는 TypeScript에서 "이 값을 절대 바뀌지 않는 리터럴 그대로 취급해라" 라는 뜻.
// 특히 배열이나 객체를 “읽기 전용 + 정확한 리터럴 타입”으로 만들고 싶을 때 사용
export const TODO_COLORS = [
    "#ff6ba9ff",
    "#4dabf7",
    "#63e6be",
    "#ffd43b",
    "#845ef7",
    "transparent"
] as const;

export type FilterType =
    | "TODO_COLORS_0"
    | "TODO_COLORS_1"
    | "TODO_COLORS_2"
    | "TODO_COLORS_3"
    | "TODO_COLORS_4"
    | "important"
    | "in_progress"
    | "d_day";

