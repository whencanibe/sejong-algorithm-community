// BigInt 값을 재귀적으로 Number로 변환하는 함수
export function normalizeBigInt(payload) {
  // payload가 배열이면, 배열의 각 요소에 대해 normalizeBigInt 재귀 호출
  if (Array.isArray(payload)) {
    return payload.map(normalizeBigInt);
  }
  // payload가 객체이면 (null 제외), 각 key-value 쌍을 순회하면서 처리
  if (payload && typeof payload === 'object') {
    return Object.fromEntries(
      Object.entries(payload).map(([k, v]) => [
        k,
        // 값이 bigint이면 Number로 변환, 아니면 재귀 호출
        typeof v === 'bigint' ? Number(v) : normalizeBigInt(v),
      ]),
    );
  }
  return payload;
}