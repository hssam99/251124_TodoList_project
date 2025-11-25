// 보드 타입
// database: / board 테이블과 매핑

export type BoardType = {
  id: number;                          // auto_increment PK (자동 생성)
  user_id: string;                     // 사용자 아이디 추후 로그인 페이지랑 연결 임시 아이디 tempuser
  board_date: string | Date;           // 사용자가 선택한 날짜
  title: string;                       // 투두리스트 제목
  reg_date: string;                    // 투두리스트 생성일시 (자동 생성) / NOW()
  todo_count: number;                  // 해당 보드에 속한 투두 아이템 개수
};