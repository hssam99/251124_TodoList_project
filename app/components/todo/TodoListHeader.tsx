import React, { useState } from "react";
import useOutsideClick from "@/app/hooks/useOutsideClick";
import { TODO_COLORS } from "@/lib/constants/todo";


type SortType = "default" | "important" | "due_date";
type FilterType = "TODO_COLORS_0" | "TODO_COLORS_1" | "TODO_COLORS_2" | "TODO_COLORS_3" | "TODO_COLORS_4" | "TODO_COLORS_5" |"important" | "in_progress" | "d_day";


type TodoListHeaderProps = {
    onUpdated?: () => void;
    sortType: SortType;
    setSortType: React.Dispatch<React.SetStateAction<SortType>>;
    filterSet: Set<FilterType>;
    setFilterSet: React.Dispatch<React.SetStateAction<Set<FilterType>>>;
};

export default function TodoListHeader({ onUpdated, sortType, setSortType, filterSet, setFilterSet }: TodoListHeaderProps) {

    // 정렬 (기본, 중요도 순, 최신 순)
    const [isSortOpen, setIsSortOpen] = useState(false);

    const sortLabelMap: Record<SortType, string> = {
        default: "기본 정렬",
        important: "중요도순",
        due_date: "마감순",
    };

    // 바깥을 클릭하면 setIsSortOpen 값 false로 변경
    const sortRef = useOutsideClick<HTMLDivElement>(() => {
        setIsSortOpen(false);
    });

    // 필터 (색상, 중요도, 작업중 순)
    // 멀티 선택 가능하도록 Set 사용
    const handleFilter = (filter: FilterType) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setFilterSet((prevSet) => {
            const newSet = new Set(prevSet);
            // 토글 방식으로 필터 추가/제거
            checked ? newSet.add(filter) : newSet.delete(filter);
            console.log("현재 선택된 필터:", Array.from(newSet));
            return newSet;
        }
        )
    };
    const isSelectedFilter = (filter: FilterType) => filterSet.has(filter);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filterRef = useOutsideClick<HTMLDivElement>(() => {
        setIsFilterOpen(false);
    });

    return (
        <div className="todo-list-header">
            <div className="todo-list-header-left">
                <div aria-label="sort-todos" className="todo-list-header-sort"
                    onClick={() => setIsSortOpen((prev) => !prev)}
                    ref={sortRef}>
                    <span className="todo-list-header-icons todo-list-header-sort-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filter-left" viewBox="0 0 16 16">
                            <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                        </svg>
                    </span>
                    <span className="todo-list-header-sort-name">{sortLabelMap[sortType]}</span>
                    {/* 메뉴: 목록 보기 */}
                    {isSortOpen && (
                        <div className="isOpen isOpen-more-list-right more-sort-list">
                            <div className="isOpen-more-Btn" onClick={() => setSortType("default")}>기본 정렬</div>
                            <div className="isOpen-more-Btn" onClick={() => setSortType("important")}>중요도순</div>
                            <div className="isOpen-more-Btn" onClick={() => setSortType("due_date")}>마감순</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="todo-list-header-right">
                <span aria-label="edit-todos" className="todo-list-header-icons" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen-fill" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001" />
                    </svg>
                </span>
                <span aria-label="clear-todos" className="todo-list-header-icons" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                    </svg>
                </span>
                <div aria-label="filter-todos" className="todo-list-header-filter"
                    ref={filterRef}>
                    <button
                        className="todo-list-header-icons"
                        onClick={() => setIsFilterOpen((prev) => !prev)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel-fill" viewBox="0 0 16 16">
                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                        </svg>
                    </button>
                    {/* 메뉴: 목록 보기 */}
                    {isFilterOpen && (
                        <div className="isOpen isOpen-more-list-left more-filter-list">
                            <label className="filter-items">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={isSelectedFilter("TODO_COLORS_0")}
                                    onChange={handleFilter("TODO_COLORS_0")} />
                                <span className="filter-checkbox-ui"></span>
                                <span className="color-dot color-dot-filter" style={{ backgroundColor: TODO_COLORS[0] }} />
                                <span>태그</span>
                            </label>
                            <label className="filter-items">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={isSelectedFilter("TODO_COLORS_1")}
                                    onChange={handleFilter("TODO_COLORS_1")} />
                                <span className="filter-checkbox-ui"></span>
                                <span className="color-dot color-dot-filter" style={{ backgroundColor: TODO_COLORS[1] }} />
                                <span>태그</span>
                            </label>
                            <label className="filter-items">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={isSelectedFilter("TODO_COLORS_2")}
                                    onChange={handleFilter("TODO_COLORS_2")} />
                                <span className="filter-checkbox-ui"></span>
                                <span className="color-dot color-dot-filter" style={{ backgroundColor: TODO_COLORS[2] }} />
                                <span>태그</span>
                            </label>
                            <label className="filter-items">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={isSelectedFilter("TODO_COLORS_3")}
                                    onChange={handleFilter("TODO_COLORS_3")} />
                                <span className="filter-checkbox-ui"></span>
                                <span className="color-dot color-dot-filter" style={{ backgroundColor: TODO_COLORS[3] }} />
                                <span>태그</span>
                            </label>
                            <label className="filter-items">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={isSelectedFilter("TODO_COLORS_4")}
                                    onChange={handleFilter("TODO_COLORS_4")} />
                                <span className="filter-checkbox-ui"></span>
                                <span className="color-dot color-dot-filter" style={{ backgroundColor: TODO_COLORS[4] }} />
                                <span>태그</span>
                            </label>
                            <label className="filter-items">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={isSelectedFilter("TODO_COLORS_5")}
                                    onChange={handleFilter("TODO_COLORS_5")} />
                                <span className="filter-checkbox-ui"></span>
                                <span>태그없음</span>
                            </label>
                            <label className="filter-items">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={isSelectedFilter("important")}
                                    onChange={handleFilter("important")} />
                                <span className="filter-checkbox-ui"></span>
                                <span>중요</span>
                            </label>
                            <label className="filter-items">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={isSelectedFilter("in_progress")}
                                    onChange={handleFilter("in_progress")} />
                                <span className="filter-checkbox-ui"></span>
                                <span>작업중</span>
                            </label>
                            <label className="filter-items">
                                <input
                                    type="checkbox"
                                    className="filter-checkbox"
                                    checked={isSelectedFilter("d_day")}
                                    onChange={handleFilter("d_day")} />
                                <span className="filter-checkbox-ui"></span>
                                <span>D-DAY</span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}