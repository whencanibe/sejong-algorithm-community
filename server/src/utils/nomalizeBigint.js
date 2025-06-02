export function normalizeBigInt(payload) {
  if (Array.isArray(payload)) {
    return payload.map(normalizeBigInt);
  }
  if (payload && typeof payload === 'object') {
    return Object.fromEntries(
      Object.entries(payload).map(([k, v]) => [
        k,
        typeof v === 'bigint' ? Number(v) : normalizeBigInt(v),
      ]),
    );
  }
  return payload;
}