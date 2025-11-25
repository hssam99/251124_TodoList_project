// 각 보드 별 todo 아이템 생성 API

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { FilterType, TODO_COLORS } from "@/lib/constants/todo";

// 1. TODO 불러오기(클라이언트 컴포넌트 GET)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const boardId = searchParams.get("board_id");
        const sort = searchParams.get("sort") || "default";
        const filters = searchParams.getAll("filter[]") as FilterType[];
        console.log("필터 파라미터:", filters);

        if (!boardId) {
            return NextResponse.json(
                { error: "board_id가 필요합니다." },
                { status: 400 }
            );
        }

        // 필터 (WHERE)
        const where: string[] = ["board_id = ?"];
        const params: any[] = [Number(boardId)];

        // 색상 필터 (TODO_COLORS_0 ~ 5)
        const colorFilters = filters.filter((f) => f.startsWith("TODO_COLORS_"));
        if (colorFilters.length > 0) {
            const colorValues = colorFilters.map((f) => {
                const index = Number(f.replace("TODO_COLORS_", ""));
                return TODO_COLORS[index];
            });

            // color IN (?, ?, ?)
            where.push(`color IN (${colorValues.map(() => "?").join(",")})`);
            params.push(...colorValues);
        }

        // 중요 필터
        if (filters.includes("important")) {
            where.push("is_important = 1");
        }

        // 진행중 필터
        if (filters.includes("in_progress")) {
            where.push("is_in_progress = 1");
        }

        // D-DAY 필터 (예: 오늘 마감인 것만)
        if (filters.includes("d_day")) {
            where.push("due_date = CURDATE()");
        }

        const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

        // 정렬 조건 (ORDER BY)
        let orderBy = "";
        if (sort === "important") {
            orderBy = "ORDER BY is_done ASC, is_important DESC";
        } else if (sort === "due_date") {
            orderBy =
                "ORDER BY is_done ASC, due_date IS NULL, due_date, due_time IS NULL, due_time";
        } else {
            orderBy =
                "ORDER BY is_done ASC, is_important DESC, due_date IS NULL, due_date, due_time IS NULL, due_time";
        }

        const query = `SELECT * FROM todo_items ${whereSql} ${orderBy}`;
        const [rows] = await db.query(query, params);

        return NextResponse.json(rows, { status: 200 });
    } catch (error: any) {
        console.error("GET /api/todo_items 에러:", error);
        return NextResponse.json(
            { error: error.message ?? "서버 에러" },
            { status: 500 }
        );
    }
}

// 2. 새 TODO 생성 (기존 생성 + 복제 기능 추가)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        //source_id > 복제용 옵션. true > 복사 / false > 새로 생성
        const {
            source_id,
            board_id,
            name,
            due_date,
            due_time,
            is_done,
            color,
            is_important,
            is_in_progress,
            contents,
        } = body;

        // 1) 복제
        if (source_id) {
            const todoId = Number(source_id);

            if (Number.isNaN(todoId)) {
                return NextResponse.json(
                    { message: "유효하지 않은 source_id 입니다." },
                    { status: 400 }
                );
            }

            // 복제 sql 쿼리
            // name 뒤에 ' (copy)' 추가, is_done은 0(미완료)로 설정
            const [result] = await db.query(
                `
        INSERT INTO todo_items
          (board_id, name, contents, due_date, due_time, is_done, color, is_important, is_in_progress)
        SELECT
          board_id,
          CONCAT(name, ' (copy)'),
          contents,
          due_date,
          due_time,
          0,
          color,
          is_important,
          is_in_progress
        FROM todo_items
        WHERE id = ?
        `,
                [todoId]
            );

            const insertId = (result as any).insertId;

            // rows가 실제 구조가 배열이 아니라 RowDataPacket[]이 아니라 이상한 타입 > any 지정
            const [rows]: any = await db.query(
                `SELECT * FROM todo_items WHERE id = ?`,
                [insertId]
            );

            if (!rows || rows.length === 0) {
                return NextResponse.json(
                    { error: "복제된 TODO 조회 실패" },
                    { status: 500 }
                );
            }

            return NextResponse.json(rows[0], { status: 201 });
        }

        // 2) source_id가 없으면 = 새 TODO 생성 (기존 로직)
        const [result] = await db.query(
            `
      INSERT INTO todo_items
        (board_id, name, contents, due_date, due_time, is_done, color, is_important, is_in_progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
            [
                board_id,
                name,
                contents || null,
                due_date || null,
                due_time || null,
                is_done ?? 0,
                color || null,
                is_important ?? 0,
                is_in_progress ?? 0,
            ]
        );

        console.log(result);
        return NextResponse.json({ message: "할일 추가 성공" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


