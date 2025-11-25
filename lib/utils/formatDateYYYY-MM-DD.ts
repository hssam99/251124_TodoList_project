// 사용 예시
// const formattedDate = formatDateYYYYMMDD(new Date());
// console.log(formattedDate); // "2025-11-21"


function formatDateYYYYMMDD(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // 0~11라 +1
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // 예: 2025-11-21
}
export default formatDateYYYYMMDD;
