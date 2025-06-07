const CACHE_KEY = "myPage:userInfo";
const CACHE_TTL = 1000 * 60 * 60;          // 60 분

//브라우저 localStorage에 저장된 userInfo 불러오는 함수. .name, .rank 등으로 접근 가능
export function loadCachedUserInfo() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL) return data;   // 60분 안지났으면 HIT
  } catch (_) { }
  return null;
}
//브라우저 localStorage에 저장시키는 함수
export function saveCachedUserInfo(data) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ ts: Date.now(), data })
  );
}
//브라우저 localStorage에 저장된 값 지우는 함수
export function clearCachedUserInfo() {
  localStorage.removeItem(CACHE_KEY);
}