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

export const findPlace = (shortcut, table, index, add) => {
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


export const newFindPlace = (shortcutList, table, index, add) => {
    if (index % 5 === 0 && table[index] !== undefined) {
        // index를 5로 나누었을 때  나머지는 0임
        // table 객체에 정의 되어있음
        // index 가 0 이 아님. 
        if (add === CODE.BACK_DO) {
            return index - 2;
        }
        let len = table[index].length;
        console.log('len : ', len)
        if (add > len) {
            // 현재 배열의 길이보다 길다면 해당 배열의 끝까지 간다음.
            // 다시한번 더 findPlace를 돌림 (재귀함수)
            return newFindPlace(shortcutList, table, table[index][len - 1], add - len);
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
            return newFindPlace(shortcutList, table, key, indexOf - 1);
        }

        return newFindPlace(shortcutList, table, key, add + indexOf + 1)
    }
    else {
        // 40 이상 
        if (add === CODE.BACK_DO) {
            return index - 2;
        }
        else if (index + add * 2 > 40) {
            return table[40];
        }
        else {
            return index + add * 2
        }
    }
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