import axios from 'axios';

const DAILY_PROBLEM_IDS = [
  // 실버 난이도 문제들
  11728, 1940, 1920, 10816, 11286, 1874, 9012, 10828, 10845, 1966,
  2164, 1158, 11866, 1021, 2346, 5430, 10866, 1406, 5397, 3190,
  14891, 15683, 15686, 14502, 14503, 14888, 14889, 15649, 15650, 15651,
  15652, 9663, 2580, 2239, 1759, 10974, 10971, 10972, 10973, 6603,
  15654, 15655, 15656, 15657, 15658, 15659, 15660, 15661, 15662, 15663,
  15664, 15665, 15666, 15667, 15668, 15669, 15670, 15671, 15672, 15673,
  // 골드 난이도 문제들
  1005, 11049, 9251, 9252, 11066, 1932, 12865, 2293, 2294, 11054,
  11055, 11057, 11052, 11053, 11047, 11048, 11051, 11050, 11049, 11046,
  11045, 11044, 11043, 11042, 11041, 11040, 11039, 11038, 11037, 11036,
  11035, 11034, 11033, 11032, 11031, 11030, 11029, 11028, 11027, 11026,
  11025, 11024, 11023, 11022, 11021, 11020, 11019, 11018, 11017, 11016
]; //원하는 문제 추가 가능

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 문제 이름들 가져와서 콘솔에 출력하는 함수 - 따로 사용하려고
async function fetchTitles() {
  const result = {};
  for (let i = 0; i < DAILY_PROBLEM_IDS.length; i++) {
    const id = DAILY_PROBLEM_IDS[i];
    try {
      const res = await axios.get('https://solved.ac/api/v3/problem/show', {
        params: { problemId: id },
        timeout: 20000,
      });
      result[id] = res.data.titleKo;
      console.log(` ${id}: "${res.data.titleKo}"`);
    } catch (e) {
      console.warn(`${id}: 실패 (${e.message})`);
    }
    await delay(500); // solved.ac rate limit 우회용
  }

  // 코드용으로 출력
  console.log('\n//복사해서 코드에 붙여넣어 쓰세요\n');
  console.log('export const PROBLEM_TITLE_MAP = {');
  for (const [id, title] of Object.entries(result)) {
    console.log(`  ${id}: "${title}",`);
  }
  console.log('};');
}

fetchTitles();