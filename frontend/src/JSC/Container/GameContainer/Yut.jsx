import React, { useReducer, useEffect, createContext, useMemo, memo, useContext } from 'react';
import styled from 'styled-components';
import { PEER_MINE_SEARCH } from 'JSC/Constants/peerDataTypes';
import { PeerDataContext, PeersContext, UserContext } from 'JSC/store';
import Yutfield from 'JSC/Component/GameComponent/Yut'
import Horses from 'JSC/Component/GameComponent/Yut/Horses';

export const UPDATE_TIMER = 'UPDATE_TIMER';
export const START_GAME = 'START_GAME';
export const RESUME_GAME = 'RESUME_GAME';
export const THROW_YUT = 'THROW_YUT';
export const SELECT_HORSE = 'SELECT_HORSE';
export const MOVE_HORSE = 'MOVE_HORSE';
export const TIME_OUT = 'TIME_OUT';
export const NEXT_TURN = 'NEXT_TURN';
export const DESELECT_HORSE = 'DESELECT_HORSE';

// export const SEND_GAME_DATA = 'SEND_GAME_DATA';


export const boardContext = createContext(null);

export const CODE = {
    BACK_DO: 0,
    DO: 1,
    GAE: 2,
    GIRL: 3,
    YUT: 4,
    MO: 5,
}

const initialState = {
    prevValue: 0,
    // table: [
    //     // 백도, 도, 개, 걸, 윷, 모,
    //     [1, 1, 2, 3, 4, 5], // 0
    //     [29, 2, 3, 4, 5, 6], // 1
    //     [1, 3, 4, 5, 8, 9], // 2
    //     [2, 4, 5, 8, 9, 10], // 3
    //     [3, 5, 8, 9, 10, 11], // 4
    //     [4, 6, 7, 26, 21, 20], // 5
    //     [5, 7, 26, 21, 20, 19], // 6
    //     [6, 26, 21, 20, 19, 22],// 7
    //     [5, 9, 10, 11, 12, 15],// 8
    //     [8, 10, 11, 12, 15, 16],// 9
    //     [9, 11, 12, 15, 16, 17],// 10
    //     [10, 12, 15, 16, 17, 18],// 11
    //     [11, 13, 14, 26, 27, 28],// 12
    //     [12, 14, 26, 27, 28, 29],// 13
    //     [13, 26, 27, 28, 29, 30],// 14
    //     [12, 16, 17, 18, 19, 22],// 15
    //     [15, 17, 18, 19, 22, 23],// 16
    //     [16, 18, 19, 22, 23, 24],// 17
    //     [17, 19, 22, 23, 24, 25],// 18

    //     // [prevValue > 15 && prevValue < 19 ? 18 : 20, 22, 23, 24, 25, 29],// 19
    //     [18, 22, 23, 24, 25, 29],// 19

    //     [21, 19, 22, 23, 24, 25],// 20
    //     [26, 20, 19, 22, 23, 24],// 21
    //     [19, 23, 24, 25, 29, 30], // 22
    //     [22, 24, 25, 29, 30, 30], // 23
    //     [23, 25, 29, 30, 30, 30], // 24
    //     [24, 29, 30, 30, 30, 30], // 25

    //     // [prevValue > 7 ? 14 : 7, 27, 28, 29, 30, 30], // 26
    //     [7, 27, 28, 29, 30, 30], // 26

    //     [26, 28, 29, 30, 30, 30], // 27
    //     [27, 29, 30, 30, 30, 30], // 28
    //     [25, 30, 30, 30, 30, 30], // 29
    //     [],

    // ],
    table: {
        10: [11, 13, 25, 27, 29, 30],
        20: [21, 23, 25],
        25: [37, 39, 40],
        40: ['finish']
    },
    playerData: [
        { nickname: '장석찬', color: 'red', horse: 4, horsePlace: {} },
        { nickname: '정진', color: 'orange', horse: 4 },
        // { nickname: 'player3', color: 'yellow' },
        // { nickname: 'player4', color: 'green' },
    ], // 몇번 칸에 누구 말이 몇개 있는지 알 수 있음.
    halted: true, // 내 순서 일때 false 그 외에는 true (정지)
    yutData: [], // 윷을 던졌을때 윷 또는 모가 나오거나, 상대 말을 잡을 때 추가
    selectHorse: undefined, // 현재 선택한 말.
    placeToMove: [],
    timer: 0, // 1초에 +1 씩 더해준다.
    myThrowCount: 0, // 윷을 던질 수 있는 횟수를 나타냄. // halted 와 useEffect 사용해서 대체할 수 있는지 테스트 // 
    winner: [], // 이긴사람을 순서대로 추가함.
    nowPlayer: 0, // 전체 차례를 받아옴.
};
const randomYut = () => {
    const yutMatchTable = {
        0: CODE.MO, // 모
        1: CODE.DO, // 도
        2: CODE.GAE, // 개
        3: CODE.GIRL, // 걸
        4: CODE.YUT  // 윷
        // 0 : 백도
    }
    const arr = [];
    for (let i = 0; i < 4; i++) {
        arr.push(Math.floor(Math.random() * 2, 1))
    }
    let result = yutMatchTable[arr.reduce((a, b) => a + b)];
    // 백도가 있으면 1 말고 0 출력
    return result === 1 && arr[0] === 1 ? CODE.BACK_DO : result;
}


const findDataInObject = (tableObj, index) => {
    let keys = Object.keys(tableObj);
    for (let i = 0; i < keys.length - 1; i++) {
        let result = table[keys[i]].indexOf(index);
        if (result !== -1) {
            console.log("키 인덱스 : ", keys[i], result)
            return { key: keys[i], indexOf: result }
        }
    }
    return { key: -1, indexOf: -1 }
}

const findPlace = (shortcut, table, index, add) => {
    if (index % 5 === 0 && table[index] !== undefined) {
        // index를 5로 나누었을 때  나머지는 0임
        // table 객체에 정의 되어있음
        // index 가 0 이 아님. 
        if (add === CODE.BACK_DO) {
            return index - 2;
        }

        len = table[index].length;
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
            return findPlace(shortcut, key, indexOf - 1);
        }

        return findPlace(shortcut, key, add + indexOf + 1)
    }
    else {
        // 40 이상 
        if (add === CODE.BACK_DO) {
            return index - 2;
        }

        let tmp = index;
        tmp = tmp + add * 2;
        if (tmp > 40) {
            tmp = table[40];
        }
        return tmp;
    }
}


const reducer = (state, action) => {
    //1. 1번 피어의 크롬이 렉걸려서 잠깐 멈췄다가 돌아옴 (상대방이랑 타이머 동기화 안됨 상황임)
    //2. 2번 피어로 차례로 넘어감
    //3. 1번 피어는 시간이 지나지 않았기에 1번 피어의 입력이 가능함
    //4. 1번 피어와 2번피어는 데이터 입력함
    //5. 1번 피어와 2번피어의 데이터를 은 양쪽에서 동시에 받음.
    //시간동기화는 필요하지 않나?
    // const { user } = useContext(UserContext);
    const { peers } = useContext(PeersContext);
    const nickname = localStorage.getItem('nickname');
    console.log("action start : ", action.type)
    let yutData;
    let res;
    switch (action.type) {
        case UPDATE_TIMER:
            return { ...state, timer: state.timer + 1 };
        case START_GAME:
            return { ...state, myThrowCount: state.myThrowCount + 1, halted: false };
        case RESUME_GAME:
            return { ...state, halted: true };
        case THROW_YUT:
            // 윷 배열에 던져 나온 수를 추가해줌.
            if (state.myThrowCount > 0) {
                const randomYutResult = randomYut();
                let myThrowCount = state.myThrowCount;
                yutData = [...state.yutData, randomYutResult];
                if (!(randomYutResult === CODE.YUT || randomYutResult === CODE.MO)) {
                    myThrowCount = myThrowCount - 1;
                }
                return { ...state, myThrowCount, yutData };
            }
            console.log("윷 던질 횟수(0이면 변동없음) : ", state.myThrowCount)
            return { ...state }
        case SELECT_HORSE:
            console.log("말 선택 : ", action.index)
            if (state.yutData.length === 0) { // 윷 던진 것이 아무것도 없으면 선택 안함.
                return { ...state }
            }
            // let placeToMove = state.table[action.index].filter((i, index) => state.yutData.includes(index));
            let arr = [...new Set(state.yutData)];
            console.log("arr set yutData : ", arr);
            let placeToMove = [];
            arr.forEach((i) => {
                console.log(i)
                console.log("findPlace : ", findPlace(0, state.table, action.index, i))
                placeToMove.push(findPlace(0, state.table, action.index, i))
            });
            console.log("말이 갈 수 있는 위치 : ", placeToMove);
            return { ...state, selectHorse: action.index, placeToMove };
        case MOVE_HORSE:
            // 사용할 윷 데이터가 들어오면 해당 윷 데이터를 삭제
            yutData = [...state.yutData];
            res = yutData.indexOf(action.useYutData)
            delete yutData[res]
            // 말을 위치로 옴김.
            return { ...state, yutData };
        case DESELECT_HORSE:
            return { ...state, selectHorse: undefined, placeToMove: [] }
        case NEXT_TURN:
            // send next user
            let nowPlayer = state.nowPlayer;
            // if (nowPlayer === state.playerData.length) {
            //     nowPlayer = 0;
            // }
            // else nowPlayer = nowPlayer + 1;
            nowPlayer = nowPlayer === state.playerData.length ? 0 : nowPlayer + 1;
            return { ...state, nowPlayer, timer: 0, halted: true };
        default:
            return state;
    }
}
// const StyledFlexDiv = styled.div`
//     display:flex;
//     flex-direction: column;
//     justify-content: space-between;
// `;

const StyledYutfield = styled(Yutfield)`
    
`;


const Yut = (props,) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { peerData } = useContext(PeerDataContext);
    const { playerData, placeToMove, myThrowCount, selectHorse, yutData, table, halted, timer, winner } = state;

    const value = useMemo(() => ({ playerData, yutData, placeToMove, selectHorse, table, halted, dispatch }), [placeToMove, playerData, halted]);

    // useEffect(() => {
    //     let timer;
    //     if (halted === false) {
    //         timer = setInterval(() => {
    //             dispatch({ type: UPDATE_TIMER })
    //         }, 1000);
    //     }
    //     return () => {
    //         clearInterval(timer);
    //     }
    // }, [halted])

    useEffect(() => {
        console.log("debug state.yutData : ", state.yutData);
    }, [yutData])

    useEffect(() => {
        if (timer > 30) {
            dispatch({ type: NEXT_TURN })
        }
    }, [timer])

    useEffect(() => {
        if (yutData.length === 0 && myThrowCount === 0) {
            dispatch({ type: NEXT_TURN })
        }
    }, [yutData, myThrowCount])

    const StyleDiv = styled.div`
        display:flex;
        height:30px;
        flex-direction: row;
        margin:10px;
    `;
    const OnContextMenu = () => (e) => {
        e.preventDefault();
        console.log('우클!');
        dispatch({ type: DESELECT_HORSE })
    }
    return (
        <div onContextMenu={OnContextMenu()}>
            <boardContext.Provider value={value}>
                <div>{timer}</div>
                <Yutfield width />
                <div>{winner}</div>
                <button onClick={() => dispatch({ type: START_GAME })}>게임 시작</button>
                <button onClick={() => dispatch({ type: THROW_YUT })}>윷 굴리기</button>
                <StyleDiv>말이 갈 수 있는 수 : {yutData.map((i) => <div> {i}</div>)}</StyleDiv>
                <div>윷 던질 수 있는 횟수 : {myThrowCount}</div>
                <div>
                    {playerData.map((i) => <div>
                        <div>닉네임 : {i.nickname}</div>
                        <div style={{ "height": "60px" }} >
                            말의 갯수 : <Horses color={i.color} horses={i.horse} />
                        </div>
                    </div>)}
                </div>
            </boardContext.Provider>
        </div >
    )
}

export default Yut;
