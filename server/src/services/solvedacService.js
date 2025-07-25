import axios from 'axios'

const SOLVEDAC_URL_BASE = "https://solved.ac/api/v3";

//사용자가 푼 문제리스트 외부 API인 solved ac api 사용하여 가져오는 함수
export async function getSolvedProblemIds(baekjoonName) {
    let pageNum = 1;
    const url = SOLVEDAC_URL_BASE + `/search/problem`;
    const solvedProblemIds = [];

    try {
        // 한 페이지당 50개의 문제가 있으므로 끝 페이지까지 가면서 문제 번호들 불러와서 저장하기
        while (true) {
            const response = await axios.get(url, {
                params: { query: `solved_by:${baekjoonName}`, page: pageNum },
            })

            const items = response.data.items;
            if (!items || items.length === 0) break;

            for (const item of items) {
                solvedProblemIds.push(item.problemId);
            }

            pageNum += 1;
        }

        return {
            user: baekjoonName, // 백준 이름
            count: solvedProblemIds.length, // 총 푼 문제수
            problemIds: solvedProblemIds, // 푼 문제 리스트

        };
    } catch (err) {//axios 에러 발생 시 실행될 catch
        console.error('API 요청 실패:', err.message);
        throw new Error('문제 목록 불러오기 실패');
    }
}

//사용자의 백준 랭킹과 티어를 외부 API인 solved ac api 사용하여 가져오는 함수
export async function getRankandTier(baekjoonName) {
    const url = SOLVEDAC_URL_BASE + '/user/show' //?handle=백준이름

    try {
        const response = await axios.get(url, {
            params: { handle: baekjoonName },
        })
        let rank = response.data.rank;
        let tier = response.data.tier;
        let solvedCount = response.data.solvedCount;
        return {
            user: baekjoonName,
            rank: rank,
            tier: tier,
            solvedCount: solvedCount,
        }
    } catch (err) {
        console.error('solvedac API 요청 실패:', err.message);
        throw new Error('존재하는 백준 아이디를 입력해 주세요');
    }

}

// 문제 번호를 이용하여 그 문제에 대한 세부 정보를 가져오는 함수. 외부 API인 solved ac api 호출.
export async function getProblemDetail(problemId) {
    const url = SOLVEDAC_URL_BASE + '/problem/show'; // ex ) ?problemId=2759
    try {
        const response = await axios.get(url, {
            params: { problemId }, timeout: 20000
        })

        let title = response.data.titleKo;
        let level = response.data.level;
        let averageTries = response.data.averageTries;
        return {
            problemId,
            title,
            level,
            averageTries
        };
    } catch (error) {
        console.error('API 요청 실패:', error.message);
        throw new Error('문제 정보 불러오기 실패');
    }
}