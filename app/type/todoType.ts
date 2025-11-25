// 투두 타입
// database: / todo 테이블과 매핑

export type TodoType = {
  id: number;
  board_id: number;
  name: string;
  contents: string;
  reg_date: string;
  due_date: string | null;
  due_time: string | null;
  is_done: boolean;
  color: string;
  is_important: boolean;
  is_in_progress: boolean;
};