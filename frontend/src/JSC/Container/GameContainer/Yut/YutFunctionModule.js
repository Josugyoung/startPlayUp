import { CODE } from './YutStore'
export const findDataInObject = (table, index) => {
    let keys = Object.keys(table);
    for (let i = 0; i < keys.length - 1; i++) {
        let result = table[keys[i]].indexOf(index);
        if (result !== -1) {
            console.log("키 인덱스 : ", keys[i], result)
            return { key: keys[i], indexOf: result }
        }
    }
    return { key: -1, indexOf: -1 }
}



export const findPlace = (shortList, table, index, add) => {
    if (index % 5 === 0 && table[index] !== undefined) {
        // index를 5로 나누었을 때  나머지는 0임
        // table 객체에 정의 되어있음
        // index 가 0 이 아님. 
        if (add === CODE.BACK_DO) {
            return index - 2;
        }
        let len = table[index].length;
        console.log('len : ', len)
        if (add > len) { // 현재 배열의 길이보다 길다면 해당 배열의 끝까지 간다음에 다시한번 더 findPlace를 돌림 (재귀함수)
            return findPlace(shortList, table, table[index][len - 1], add - len);
        }
        else {
            return table[index][add - 1];
        }
    }
    else if (index % 2 === 0) {
        // 40 이상 
        let tmp;
        if (add === CODE.BACK_DO) {
            return index - 2 === 0 ? 40 : index - 2;
        }
        return (index + add * 2) > 40 ? table[40] : (index + add * 2);

    }
    else if (index % 2 === 1) { // 
        let { key, indexOf } = findDataInObject(table, index);
        console.log(shortList, table, key, add + indexOf)
        if (add === CODE.BACK_DO) { // 백도가 들어오면
            console.log("%2 indexOf", indexOf, key)
            if (indexOf === 0) return key
            return findPlace(shortList, table, key, indexOf);
        }

        return findPlace(shortList, table, key, add + indexOf + 1)
    }
}

export const checkSelectState = (selectHorse, placeToMove, index) => {
    if (selectHorse === undefined || !placeToMove.hasOwnProperty(String(index))) {
        console.log("out of MOVE_HORSE");
        return true;
    }
    return false;
}

export const checkEmptySelectHorse = (selectHorse) => {
    if (selectHorse === undefined) {
        // console.log("checkEmptySelectHorse true");
        return true;
    }
    return false;
}

export const checkHavePlaceToMove = (placeToMove, index) => {
    if (!placeToMove.hasOwnProperty(String(index))) {
        // console.log("checkHavePlaceToMove true");
        return true;
    }
    return false;
}

export const checkMyTurn = (player, turn) => {
    if (player === turn) {
        // console.log("checkMyTurn true");
        return true;
    }
    return false;
}






export const backupFindPlace = (shortcut, table, index, add) => {
    if (index % 5 === 0 && table[index] !== undefined) {
        // index를 5로 나누었을 때  나머지는 0임
        // table 객체에 정의 되어있음
        // index 가 0 이 아님. 
        if (add === CODE.BACK_DO) {
            return index - 2;
        }
        let len = table[index].length;
        console.log('len : ', len)
        if (add > len) { // 현재 배열의 길이보다 길다면 해당 배열의 끝까지 간다음에 다시한번 더 findPlace를 돌림 (재귀함수)
            return findPlace(shortcut, table, table[index][len - 1], add - len);
        }
        else {
            return table[index][add - 1];
        }
    }
    else if (index % 2 === 1) { // 
        let { key, indexOf } = findDataInObject(table, index);

        if (add === CODE.BACK_DO) { // 백도가 들어오면
            console.log("%2 indexOf", indexOf, key)
            if (indexOf === 0) {
                console.log("%2 with key")
                return key
            }
            return findPlace(shortcut, table, key, indexOf - 1);
        }

        return findPlace(shortcut, table, key, add + indexOf + 1)
    }
    else {
        // 40 이상 
        let tmp;
        if (add === CODE.BACK_DO) {
            tmp = index - 2
            if (tmp === 0) {
                tmp = 40;
            }
            return tmp;
        }

        tmp = index;
        tmp = tmp + add * 2;
        if (tmp > 40) {
            tmp = table[40];
        }
        return tmp;
    }
}