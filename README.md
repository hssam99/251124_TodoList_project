# ✍️ **NEXT-TODO**

**개발기간:** 2025.11.20 ~ 2025.11.24 (3 DAYS)
**Contact:** [sumin5400@gmail.com](mailto:sumin5400@gmail.com)

Next.js(App Router) + MySQL 기반의 TodoList 웹 애플리케이션입니다.

할 일 생성, 수정, 삭제, 정렬 및 필터링을 포함한 기본 CRUD 기능을 모두 구현했습니다.

---

# 📁 **디렉토리 구조**

```bash
next-todo
│
├─ .env.local
│
├─ lib
│   ├─ db.ts                 # MySQL 연결 설정
│   ├─ constants
│   │   └─ todo.ts           # 공통 상수 (color, filterType 등)
│   └─ utils
│       └─ utils.ts          # 공용 유틸 함수 (날짜 포맷 등)
│
├─ app
│   ├─ layout.tsx            # 전체 레이아웃 (Header / Footer)
│   ├─ page.tsx              # 메인 페이지
│   ├─ globals.css
│
│   ├─ type                  # 타입 정의
│   │   ├─ boardType.ts      # todo_boards 타입
│   │   └─ todoType.ts       # todo_items 타입
│
│   ├─ api                   # Next.js API Routes (백엔드)
│   │   ├─ todo_boards
│   │   │   ├─ route.ts      # POST: 보드 생성 / GET: 보드 목록
│   │   │   └─ [id]
│   │   │       └─ route.ts  # PATCH/DELETE: 특정 보드 관리
│   │   │
│   │   └─ todo_items
│   │       ├─ route.ts      # POST: todo 생성 / GET: todo 목록
│   │       └─ [id]
│   │           └─ route.ts  # PUT/DELETE: todo 수정/삭제
│
│   ├─ todo
│   │   └─ [id]
│   │       └─ page.tsx      # 특정 보드 상세 페이지
│
│   ├─ components
│   │   ├─ layout
│   │   │   ├─ Header.tsx
│   │   │   └─ Footer.tsx
│   │   │
│   │   ├─ board
│   │   │   ├─ MakeTodoButton.tsx
│   │   │   └─ BoardList.tsx
│   │   │
│   │   └─ todo
│   │       ├─ TodoCardHeader.tsx
│   │       ├─ TodoItemInput.tsx
│   │       ├─ TodoList.tsx
│   │       ├─ TodoListHeader.tsx
│   │       ├─ TodoListRow.tsx
│   │       └─ TodoRowMain.tsx
│
│   └─ hooks
│       └─ useOutsideClick.ts
│
└─ public
    ├─ images
    ├─ icons
    └─ fonts
```

---

# 📊 **데이터베이스 구조**

## 📌 `todo_boards` 테이블

```sql
CREATE TABLE todo_boards (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    board_date DATE NOT NULL,
    title VARCHAR(255) DEFAULT NULL,
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FOREIGN KEY (user_id) REFERENCES users(id)  # 로그인 구현 시 연결 예정
```

---

## 📌 `todo_items` 테이블

```sql
CREATE TABLE todo_items (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  board_id INT NOT NULL,
  name VARCHAR(300) NOT NULL,
  contents VARCHAR(500),
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date VARCHAR(20) NULL,
  due_time TIME DEFAULT NULL,
  is_done TINYINT(1) NOT NULL DEFAULT 0,
  color VARCHAR(20) NULL,
  is_important TINYINT(1) NOT NULL DEFAULT 0,
  is_in_progress TINYINT(1) DEFAULT 0,

  FOREIGN KEY (board_id)
    REFERENCES todo_boards(id)
    ON DELETE CASCADE
);
```

---

# 🖥️ **메인 화면**

<img width="1512" height="949" src="https://github.com/user-attachments/assets/c9d2efb8-a718-4c10-816a-0226b7028ddf" />

### ✅ 구현 기능

* 홈 버튼
* 폴더 이미지 상태 변경

  * 투두 없음 → 빈 폴더
  * 투두 있음 → 찬 폴더
* “MAKE TODOLIST” 클릭 시 새 보드 생성
  → `api/todo_boards/route.ts` (POST)
* ✨ 로그인 기능 추후 구현 예정

---

# 📋 **새로운 투두리스트 화면**

<img width="1512" height="949" src="https://github.com/user-attachments/assets/80687a33-9c44-4bf0-a561-66abb09755ae" />

### ✅ 구현 기능

* 상세 페이지와 동일 구조
* 제목: **"나의 새로운 투두리스트"** 자동 입력
* 현재 로컬 날짜 자동 삽입

---

# 📋 **투두리스트 상세 화면**

<img width="1512" height="949" src="https://github.com/user-attachments/assets/deda6ed5-f45c-4699-87e6-1e26c2b23a7c" />

---

# 🧩 **상세 기능 구현**

## 1️⃣ **TodoCardHeader.tsx — 보드 상단 UI**

* 보드 제목 및 날짜 수정 가능 (Inline Editing)
* 보드 삭제
  → `ON DELETE CASCADE`로 연결된 todo_items 자동 삭제
* 현재 작업 중인 Todo 개수 표시
* 🔨 진행중/완료 카운트 태그 추후 추가 예정
* 🔨 메모 기능 확장 예정

---

## 2️⃣ **TodoItemInput.tsx — 새로운 Todo 입력**

* 새 할 일 생성 (POST)
  → `api/todo_items/route.ts`
* 입력 항목

  * color
  * name
  * due_date
  * due_time
  * is_important
* 자동 기본값

  * is_done = false
  * is_in_progress = false
* 색상 선택 UI → `useOutsideClick` 훅 사용

---

## 3️⃣ **TodoListHeader.tsx — 정렬 및 필터 기능**

* 정렬 / 필터 메뉴
* 정렬 옵션 : 기본, 중요도, 마감순 `type SortType = "default" | "important" | "due_date";`  
* 필터 옵션 : 색상 태그, 중요도, 진행중, D-DAY
* Axios 사용해 fetch 코드 간소화
* initialTodos 기반 상태 관리 → `useEffect()` 사용하여 새로고침 없이 즉시 반영
* 외부 클릭 시 닫히지 않도록 `useOutsideClick` 적용
* API 구조

  * GET → `api/todo_items/route.ts`
  * SQL WHERE `whereSql`
  * SQL ORDER BY `orderBy`
* 🔨 Clear 기능(보드 유지 / 아이템만 삭제) 예정
* 🔨 다중 선택 후 삭제/공유 기능 예정

---

## 4️⃣ **TodoListRow.tsx + TodoRowMain.tsx — 할 일 한 줄 UI**

### TodoListRow.tsx

* Todo 리스트 출력 (map)
* 수정 / 삭제 / 복제 기능
* API

  * DELETE → `deleteTodo()`
  * POST → `duplicateTodo()`
  * 복제 로직: `source_id` 여부로 생성/복제 분기
* 더보기 메뉴 제공

너, 아래처럼 **README에 넣기 딱 좋은 깔끔한 버전**으로 정리해줬어! 문장 흐름/가독성 맞춰서 다른 섹션 스타일과 동일하게 맞췄어.

---

### **TodoRowMain.tsx**

* 할 일 상세 UI + 수정(Inline Editing) 담당 컴포넌트
* 색상(Color) 선택 기능 지원 (총 6가지 옵션)

  ```ts
  export const TODO_COLORS = [
    "#ff6ba9ff",
    "#4dabf7",
    "#63e6be",
    "#ffd43b",
    "#845ef7",
    "transparent"
  ] as const;
  ```
* 날짜(due_date) 상태 표시

  * **D+N**: 마감일이 지난 경우(회색)
  * **D-N**: 마감일까지 남은 경우(초록)
  * **D-DAY**: 당일 마감(빨강)
* 진행중(is_in_progress), 중요도(is_important) 값이 `true`일 때만 UI에 노출
* 수정 시 **PATCH 요청** 처리

  * API → `api/todo_items/[id]/route.ts`
* **수정 가능한 필드**

  * `is_done`
  * `is_in_progress`
  * `is_important`
  * `name`
  * `due_time`
  * `due_date`


---

# 🚀 마무리

Next.js(App Router) 기반으로 **프론트와 백엔드(API Route) 모두 구현한 풀스택 Todo 프로젝트**입니다.

CRUD 기능을 구현했습니다.

감사합니다.
