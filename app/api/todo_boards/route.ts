// todo_boards DB 불러오기

import { NextRequest } from "next/server";
import { db } from '@/lib/db';
import { NextResponse } from "next/dist/server/web/spec-extension/response";


// 1. 새 투두리스트 생성 (POST 메서드)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("body:", body);
    const { user_id = 1, board_date, title } = body;

    // 1) 초기값
    //   user_id: 임시 유저 아이디 (추후 로그인 기능 구현 시 연결)
    //   board_date: 오늘 날짜
    //   title: "새로운 투두리스트"
    const [result]: any = await db.query(
      `
      INSERT INTO todo_boards (user_id, board_date, title)
      VALUES (
        ?,
        COALESCE(?, CURDATE()),
        COALESCE(?, '나의 새로운 투두리스트')
      )
      `,
      [user_id, board_date, title]
    );

    const insertedId = result.insertId;

    return NextResponse.json(
      {
        id: insertedId,
        user_id,
        board_date,
        title,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("todo_boards INSERT error:", error);
    return NextResponse.json(
      { message: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 2. 모든 투두리스트 불러오기 (GET 메서드) -> BoardList에서 사용(폴더 이미지)
export async function GET() {
  const [rows]: any = await db.query(`
    SELECT 
      b.*,
      (SELECT COUNT(*) FROM todo_items t WHERE t.board_id = b.id) AS todo_count
    FROM todo_boards b
    ORDER BY b.board_date DESC
  `);

  return NextResponse.json(rows);
}
