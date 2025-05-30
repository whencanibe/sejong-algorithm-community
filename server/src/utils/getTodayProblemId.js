export function getTodayProblemId() {
    const today = new Date().toISOString().split('T')[0];
    const hash = [...today].reduce((acc, c) => acc + c.charCodeAt(0), 0);


   // const problemId = 1000 + (hash % 1000); // 일단 1000 ~ 1999
    return 2884;
  }