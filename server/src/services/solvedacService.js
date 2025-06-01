import axios from 'axios'

export async function getSolvedProblemIds(baekjoonName) {
    let pageNum = 1;
    const url = `https://solved.ac/api/v3/search/problem`;
    const solvedProblemIds = [];

    try {
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
            user: baekjoonName,
            count: solvedProblemIds.length,
            problemIds: solvedProblemIds,
            
        };
    } catch (err) {//axios 에러 발생 시 실행될 catch
        console.error('API 요청 실패:', err.message);
        throw new Error('문제 목록 불러오기 실패');
    }
}

export async function getRankandTier(baekjoonName) {
    const url = 'https://solved.ac/api/v3/user/show' //?handle=백준이름

    try {
        const response = await axios.get(url, {
            params: { handle: baekjoonName }
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

export async function getProblemDetail(problemId) {
    const url = 'https://solved.ac/api/v3/problem/show'; // ex ) ?problemId=2759
    try {
        const response = await axios.get(url, {
            params: { problemId }
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
        console.error('API 요청 실패:', err.message);
        throw new Error('문제 정보 불러오기 실패');
    }
}