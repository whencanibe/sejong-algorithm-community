//UTC 기준 하루 전날 15시가 한국 시간의 자정을 의미함. 
export function kstMidnight() {
  const d = new Date();
  d.setUTCHours(15, 0, 0, 0);

  d.setUTCDate(d.getUTCDate() - 1);
  return d;
}