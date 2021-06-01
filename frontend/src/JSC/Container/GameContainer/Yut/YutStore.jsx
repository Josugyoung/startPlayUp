import React, { useReducer, useEffect, createContext, useMemo, memo, useContext } from 'react';
import styled from 'styled-components';
import { PeerDataContext, PeersContext, UserContext } from 'JSC/store';
import { checkPlace, checkSelectState, checkEmptySelectHorse, checkHavePlaceToMove } from './YutFunctionModule.js'

export const UPDATE_TIMER = 'UPDATE_TIMER';
export const START_GAME = 'START_GAME';
export const RESUME_GAME = 'RESUME_GAME';
export const MY_TURN = 'MY_TURN';
export const THROW_YUT = 'THROW_YUT';
export const SELECT_HORSE = 'SELECT_HORSE';
export const MOVE_FIRST_HORSE = 'MOVE_FIRST_HORSE';
export const MOVE_HORSE_USE_PLACE = 'MOVE_HORSE_USE_PLACE';
export const MOVE_HORSE_USE_YUTDATA = 'MOVE_HORSE_USE_YUTDATA';
export const MOVE_HORSE = 'MOVE_HORSE';
export const UPDATE_GOAL = 'UPDATE_GOAL'
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
    playerData: [
        { nickname: '장석찬', color: 'red', horses: 4, goal: 0 },
        { nickname: '정진', color: 'orange', horses: 4, goal: 0 },
        { nickname: '이종찬', color: 'blue', horses: 4, goal: 0 },
        // { nickname: 'player3', color: 'yellow' },
        // { nickname: 'player4', color: 'green' },
    ], // 몇번 칸에 누구 말이 몇개 있는지 알 수 있음.
    // horsePosition: { 2: { player: 0, horses: 2, placeList: [] } },
    horsePosition: {},
    halted: false, // 내 순서 일때 false 그 외에는 true (정지)
    yutData: [], // 윷을 던졌을때 윷 또는 모가 나오거나, 상대 말을 잡을 때 추가
    selectHorse: undefined, // 현재 선택한 말.
    placeToMove: {},
    timer: 0, // 1초에 +1 씩 더해준다.
    myThrowCount: 1, // 윷을 던질 수 있는 횟수를 나타냄. // halted 와 useEffect 사용해서 대체할 수 있는지 테스트 // 
    winner: [], // 이긴사람을 순서대로 추가함.
    nowTurn: 0,
    myTurn: 0,
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

const reducer = (state, action) => {
    //1. 1번 피어의 크롬이 렉걸려서 잠깐 멈췄다가 돌아옴 (상대방이랑 타이머 동기화 안됨 상황임)
    //2. 2번 피어로 차례로 넘어감
    //3. 1번 피어는 시간이 지나지 않았기에 1번 피어의 입력이 가능함
    //4. 1번 피어와 2번피어는 데이터 입력함
    //5. 1번 피어와 2번피어의 데이터를 은 양쪽에서 동시에 받음.
    //시간동기화는 필요하지 않나?
    action.type !== UPDATE_TIMER && console.log("action start : ", action.type)
    let yutData;
    // let horsePosition;
    let goal;
    switch (action.type) {
        case UPDATE_TIMER:
            return { ...state, timer: state.timer + 1 };
        case START_GAME:
            return { ...initialState, myThrowCount: state.myThrowCount + 10, halted: false };
        case RESUME_GAME:
            return { ...state, halted: true };
        case MY_TURN: {
            return { ...state, halted: false };
        }

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
            return { ...state }
        case SELECT_HORSE:
            console.log("말 선택 : ", action.index)
            if (state.yutData.length === 0) { // 윷 던진 것이 아무것도 없으면 선택 안함.
                return { ...state }
            }
            // let placeToMove = state.table[action.index].filter((i, index) => state.yutData.includes(index));
            let arr = [...new Set(state.yutData)];
            // console.log("arr set yutData : ", arr);
            let placeToMove = {};
            arr.forEach((i) => {
                if (action.index === 0) {
                    placeToMove[checkPlace([], action.index, i)] = i
                }
                else {
                    placeToMove[checkPlace(state.horsePosition[action.index].placeList, action.index, i)] = i
                }
            });
            console.log("말이 갈 수 있는 위치 : ", placeToMove);
            return { ...state, selectHorse: action.index, placeToMove };

        case MOVE_FIRST_HORSE: {
            // 선택한 말이 없는 상태에서 눌렸거나 해당 값이 없으면 말을 이동하지 않음.
            if (checkEmptySelectHorse(state.selectHorse) ||
                checkHavePlaceToMove(state.placeToMove, action.index)) {
                return { ...state };
            }

            // 사용할 윷 데이터가 들어오면 해당 윷 데이터를 삭제
            yutData = [...state.yutData];
            yutData.splice(yutData.indexOf(state.placeToMove[action.index]), 1);
            // 말 이동 관련 코드
            // 만약에 selectHorse 가 0 이라면 (윷 판에 말이 없는 경우)
            const horsePosition = { ...state.horsePosition };
            // let nowTurn = horsePosition[action.index]['player']
            const nowTurn = state.nowTurn;
            const playerData = [...state.playerData]
            playerData[nowTurn] = { ...playerData[nowTurn], horses: playerData[nowTurn].horses - 1 }

            if (state.horsePosition.hasOwnProperty(String(action.index))) {
                // 겹치기
                horsePosition[action.index] = {
                    ...state.horsePosition[action.index],
                    'horses': state.horsePosition[action.index].horses + 1
                };
            }
            else {
                horsePosition[action.index] = { player: nowTurn, horses: 1, placeList: [] }
            }

            // 만약에 먹으면 먹힌 사람 말 갯수 올려주고 
            // 내거라면 위치에 + 1 해주고
            return { ...state, yutData, playerData, horsePosition, selectHorse: undefined, placeToMove: {} };
        }

        case MOVE_HORSE: {
            // 선택한 말이 없는 상태에서 눌렸거나 해당 값이 없으면 말을 이동하지 않음.
            // if (checkSelectState(state.selectHorse, state.placeToMove, action.index)) return { ...state };

            if (checkEmptySelectHorse(state.selectHorse) ||
                checkHavePlaceToMove(state.placeToMove, action.index)) {
                return { ...state };
            }

            // 사용할 윷 데이터가 들어오면 해당 윷 데이터를 삭제
            // yutData = deleteYutDataOfOne(state.yutData, state.placeToMove, action.index); // 오류나는데 이유 확인 해야함. 
            yutData = [...state.yutData];
            yutData.splice(yutData.indexOf(state.placeToMove[action.index]), 1);


            // 말 이동 관련 코드
            const horsePosition = { ...state.horsePosition };
            if (horsePosition.hasOwnProperty(String(action.index))) {
                // 겹치기 
                // 겹칠때 플레이어도 비교해야것는데?
                horsePosition[action.index] = {
                    ...state.horsePosition[action.index],
                    'horses':
                        state.horsePosition[action.index].horses +
                        state.horsePosition[state.selectHorse].horses
                };
            }
            else {
                const placeList = [...state.horsePosition[state.selectHorse].placeList];
                // if (state.selectHorse < action.index && [10, 20, 25, 30].includes(state.selectHorse)) {
                placeList.push(state.selectHorse);
                // }

                horsePosition[action.index] = { ...horsePosition[state.selectHorse], placeList };
            }
            delete horsePosition[state.selectHorse]

            return { ...state, yutData, horsePosition, selectHorse: undefined, placeToMove: {} };
        }
        case UPDATE_GOAL: {
            // 말 위치 데이터가 변경이 되었다면 골인지점 에 있는 상태인지 확인,
            // 골인지점에 있다면 점수 올리고 말 삭제
            if (state.horsePosition.hasOwnProperty(30)) {
                const playerData = [...state.playerData]
                const horsePosition = { ...state.horsePosition };
                const player = horsePosition[30].player;
                goal = playerData[player].goal // 플레이어 데이터의 goal과 
                    + horsePosition[30].horses // 현재 골인지점에 있는 말들을 더함.
                delete horsePosition[30]; // 골인 지점 말 삭제
                playerData[player] = { ...playerData[player], goal }
                return { ...state, horsePosition, playerData }
            }
            else {
                return { ...state }
            }
        }
        case DESELECT_HORSE:
            return { ...state, selectHorse: undefined, placeToMove: {} };
        case NEXT_TURN:
            // send next user
            const nowTurn = state.nowTurn === state.playerData.length - 1 ? 0 : state.nowTurn + 1;
            return { ...state, placeToMove: {}, myThrowCount: 1, yutData: [], nowTurn, timer: 0, halted: true };
        default:
            return state;
    }
}

const YutStore = ({ children }) => {
    // dispatch는 실행중 변경하지 않기에 useMemo를 통해 제함.
    const [state, dispatch] = useReducer(reducer, initialState);
    const { playerData, placeToMove, myThrowCount, selectHorse, yutData, halted, timer, nowTurn, myTurn, horsePosition } = state;

    // 타이머 돌리기
    useEffect(() => {
        let timer;
        if (halted === false) {
            timer = setInterval(() => {
                dispatch({ type: UPDATE_TIMER })
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        }
    }, [halted])

    // useEffect(() => {
    //     console.log("debug state.yutData : ", state.yutData);
    // }, [yutData])

    // 타이머가 30 초가 넘었을 때 순서 넘기기
    // useEffect(() => {
    //     if (timer > 30) {
    //         dispatch({ type: NEXT_TURN })
    //     }
    // }, [timer])

    // 순서 넘기기
    useEffect(() => {
        if (yutData.length === 0 && myThrowCount === 0) {
            dispatch({ type: NEXT_TURN })
        }
    }, [yutData, myThrowCount])

    useEffect(() => {
        // 말 위치 데이터가 변경이 되었다면 골인지점 에 있는 상태인지 확인,
        // 골인지점에 있다면 점수 올리고 말 삭제
        dispatch({ type: UPDATE_GOAL })
    }, [horsePosition]);

    useEffect(() => {
        if (nowTurn === myTurn) {
            dispatch({ type: MY_TURN })
        }
    }, [nowTurn])

    useEffect(() => {
        console.log("hp : ", horsePosition);
    }, [horsePosition])

    const value = useMemo(() => ({ playerData, yutData, placeToMove, selectHorse, halted, dispatch, horsePosition, myThrowCount, nowTurn, myTurn }), [selectHorse, myThrowCount, placeToMove, horsePosition, playerData, nowTurn, myTurn, yutData, halted]);


    return (
        <div>
            <boardContext.Provider value={value}>
                <div>{timer}</div>
                {children}
            </boardContext.Provider >
        </div>
    );
}

export default YutStore;