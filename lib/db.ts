import mysql, { Pool } from "mysql2/promise";

// 자동으로 .env.local 파일을 호출해옴
// process.env.MYSQL_HOST

// export const db = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     port: Number(process.env.MYSQL_PORT),
//     database: process.env.MYSQL_DATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
//     // waiftForConnections: true -> 연결이 없을 때까지 기다림
//     // connectionLimit: 10 -> 최대 연결 수
//     // queueLimit: 0 -> 대기열 제한 없음
// });

// lib/db.ts

// ----------------- DB 접속 에러떠서 수정 -----------------

// dev 모드에서 hot-reload가 되더라도
// 이미 만들어진 pool이 있으면 그걸 재사용하기 위한 타입 선언
declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: Pool | undefined;
}

// 이미 globalThis에 풀 있으면 재사용, 없으면 새로 생성
const pool =
  globalThis.mysqlPool ??
  mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true, // 날짜를 문자열로 받기 위해 추가
  });

// dev 환경에서는 pool을 globalThis에 박아두고 재사용
if (process.env.NODE_ENV !== "production") {
  globalThis.mysqlPool = pool;
}

export const db = pool;
