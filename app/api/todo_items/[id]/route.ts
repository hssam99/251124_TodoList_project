// 각 todo(할일) 별 수정, 삭제 API 라우트

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


// 1. TODO 삭제
// _: NextRequest : 요청 객체(userInput)를 사용하지 않으므로 언더스코어(_) -변수명 없음- 로 표기
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const todoId = Number(id);

    try {
        const [result] = await db.query(
            `DELETE FROM todo_items WHERE id = ?`,
            [todoId]
        )

        console.log("DELETE result:", result);

        return NextResponse.json({ message: "할일 삭제 성공" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 2. TODO 수정 (PATCH)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const todoId = Number(id);

    const userInput = await request.json();
    const { name, due_date, due_time, is_done, color, is_important, is_in_progress } = userInput;

    try {
        const [result] = await db.query(
            `UPDATE todo_items
             SET name = ?, due_date = ?, due_time=?, is_done = ?, color=?, is_important = ?, is_in_progress=?
             WHERE id = ?`,
            [name, due_date || null, due_time || null, is_done, color || null, is_important, is_in_progress, todoId]
        );

        console.log("result:", result);
        return NextResponse.json({ message: "todo 수정 성공" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}

