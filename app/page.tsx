import BoardList from './components/board/BoardList';
import { db } from '@/lib/db';
import { BoardType } from './type/boardType';
import MakeTodoButton from './components/board/MakeTodoButton';


// todo_boards DB 불러오기
// getBoards 함수는 비동기 함수로, BoardType 배열로 반환합니다.
async function getBoards(): Promise<BoardType[]> {
  // mysql2/promise는 const [rows, fields] = await db.query(...)를 리턴함
  // 우리가 필요한건 rows이므로, fields는 사용하지 않음
  const [rows] = await db.query(`
    SELECT 
      b.*,
      (
        SELECT COUNT(*) 
        FROM todo_items t
        WHERE t.board_id = b.id
      ) AS todo_count
    FROM todo_boards b
    ORDER BY b.board_date
  `);
  return rows as BoardType[];
}


export default async function Home() {
  const boards = await getBoards();
  // console.log("boards(await getBoards();)", boards);
  // console.log("boards type", typeof boards);
  // 배열 형태로 리턴 [Object, Object, ...]
  // Object -> 하나의 row (보드 1개 데이터)

  console.log("boards", boards);

  return (
    <div className="home-page">
      <MakeTodoButton />
      <BoardList boards={boards} />
      {/* BoardList({ boards: boards }) */}
    </div>
  );
}
