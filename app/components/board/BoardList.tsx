"use client";

import formatDateYYYYMMDD from '@/lib/utils/formatDateYYYY-MM-DD';
import { BoardType } from '../../type/boardType';
import { useRouter as userRouter } from 'next/navigation';

type BoardListProps = {
    boards: BoardType[];
}

export default function BoardList({ boards }: BoardListProps) {
    console.log("boards", boards);
    const router = userRouter();

    // 카드 클릭 핸들러
    // 카드 클릭 시 해당 투두리스트 페이지로 이동
    const handleClick = (id: number) => {
        router.push(`/todo/${id}`);
    }

    if (!boards || boards.length === 0) {
        return <div className="empty-text">🙈 아직 생성된 투두리스트가 없어요</div>;
    }

    return (
        <div className="board-container">
            <h2 className="board-title">나의 TO DO LIST</h2>
            <div className="board-grid">
                {boards.map((board) => (
                    // 카드 컴포넌트
                    <button
                        key={board.id}
                        className="board-card"
                        onClick={() => handleClick(board.id)}
                    >
                        <div className="card-icon-box">
                            <img
                                src={
                                    board.todo_count > 0
                                        ? "/icons/folderfill-icon-macos.png"
                                        : "/icons/folder-icon-macos.png"
                                }
                                alt=""
                                className="card-icon"
                            />
                        </div>
                        <div className='card-text'>
                            <div className='card-date'>
                                {formatDateYYYYMMDD(board.board_date)}
                            </div>
                            <div className="card-title">{board.title}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
