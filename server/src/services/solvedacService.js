import axios from 'axios'

export async function getSolvedProblemIds(baekjoonName) {
    let pageNum = 1;
    const url = `https://solved.ac/api/v3/search/problem`;

    const solvedProblemIds = [];

    while (true) {
        const response = await axios.get(url, {
            params: { query: `solved_by:${baekjoonName}`, page: pageNum }
        });
        if (!response){
            throw new Error("해결문제목록불러오기실패");
        }

        const items = response.data.items;

        if(!items || items.length === 0) break; // 더 이상 문제 페이지 없을 때
        
        for(const item of items){
            solvedProblemIds.push(item.problemId)
        }
        
        pageNum += 1;
    }

    //console.log(solvedProblemIds); //테스트

    return {
        user : baekjoonName,
        count : solvedProblemIds.length,
        problemId: solvedProblemIds,
    }
}