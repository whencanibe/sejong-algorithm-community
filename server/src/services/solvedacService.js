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
            params: { handle: baekjoonName },
            // headers: {
            //     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
            //     'Cookie': 'cf_clearance=0OU0bubRYSExbw7TkokLQ0JfRaeuecr19qHA34JBaP0-1749233246-1.2.1.1-G9RXDQt.0SWVYGiSFCEAgi3n1a2x7DCAq6rE2UyiJkPKkfXIWD3h7yzdJbPjqHlH0iiuT9i4Z.4wEz7vJQQgWO2hwerK4fOIfDOZh6qscfO4yCOrTY63t.LYjWxb5L4IPPW20lcSfPKZ206bbXGG6gWlBz9H1fEfsdm38SsdNtgs4J68ADugI_z3tbqUSK9PSz9Azp1fDaDjpMu7Uwb8pHms.ErWJLTz.4xEYBOxtnh_M_7bnWU8bCcZ_aBRxEI4rWtPBfAnB1KIfYHjCwZTZ18jRL1OUppRxYZx5pAcWlov7vgSB4w5NE4vj14ibIXvZtN65yOX.jRvNXAlmKd8XMNQkdOihEW875_fAqOzItb6qZEgFySVqO3tTr6zoIxW',
            //     'Accept': 'application/json'
            // }
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