import axios from 'axios'
import { findUserById } from '../repositories/userRepository.js';

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
            problemId: solvedProblemIds,
        };
    } catch (err) {//axios 에러 발생 시 실행될 catch
        console.error('API 요청 실패:', err.message);
        throw new Error('문제 목록 불러오기 실패');
    }
}

export async function getRank(baekjoonName) {
    const url = 'https://solved.ac/api/v3/user/show' //?handle=백준이름

    try {
        const response = await axios.get(url, {
            params: { handle: baekjoonName }
        })
        let rank = response.data.rank;

        return {
            user: baekjoonName,
            rank: rank,
        }
    } catch (err) {
        console.error('API 요청 실패:', err.message);
        throw new Error('사용자 랭킹 불러오기 실패');
    }

}