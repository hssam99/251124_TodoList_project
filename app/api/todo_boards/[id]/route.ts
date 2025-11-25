import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// 1. 보드 수정
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const { title, board_date } = await req.json();

        const boardId = Number(id);
        if (Number.isNaN(boardId)) {
            return NextResponse.json(
                { message: "유효하지 않은 id 입니다." },
                { status: 400 }
            );
        }

        await db.query(
            `
            UPDATE todo_boards
            SET 
                title = COALESCE(?, title),
                board_date = COALESCE(?, board_date)
            WHERE id = ?`,
            [title ?? null, board_date ?? null, boardId]
        );

        return NextResponse.json(
            { success: true, id: boardId, title, board_date },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("PATCH /api/todo_boards/[id] error:", error);
        return NextResponse.json(
            {
                message: "보드 수정 중 서버 에러가 발생했습니다.",
                error: String(error?.message ?? error),
            },
            { status: 500 }
        );
    }
}

// 2. 보드 삭제
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const boardId = Number(id);
        if (Number.isNaN(boardId)) {
            return NextResponse.json(
                { message: "유효하지 않은 id 입니다." },
                { status: 400 }
            );
        }

        await db.query(`DELETE FROM todo_boards WHERE id = ?`, [boardId]);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("DELETE /api/todo_boards/[id] error:", error);
        return NextResponse.json(
            {
                message: "보드 삭제 중 서버 에러가 발생했습니다.",
                error: String(error?.message ?? error),
            },
            { status: 500 }
        );
    }
}
