let allTier = ['브론즈', '실버', '골드', '플래티넘', '다이아몬드', '루비'];
let allSubtier = ['V', 'IV', 'III', 'II', 'I'];

//정수로 저장된 티어를 텍스트로 바꿔주는 함수
export function stringifyTier(tierNum) {
    let tier = 0;
    let subtier = 0;

    if (Number.isInteger(tierNum / 5)) {
        tier = Math.floor(tierNum / 5) - 1;
    } else {
        tier = Math.floor(tierNum / 5);
    }

    if (tierNum % 5 == 1) {
        subtier = 0;
    } else if (tierNum % 5 == 0) {
        subtier = 4;
    } else {
        subtier = (tierNum % 5) - 1;
    }

    return `${allTier[tier]} ${allSubtier[subtier]}`;
}