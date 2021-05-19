import React, { useReducer, useEffect, createContext, useMemo, memo, useContext } from 'react';
import styled from 'styled-components';
import { PEER_MINE_SEARCH } from 'JSC/Constants/peerDataTypes';
import { PeerDataContext, PeersContext, UserContext } from 'JSC/store';
import Yutfield from 'JSC/Component/GameComponent/Yut'

export const UPDATE_TIMER = 'UPDATE_TIMER';
export const START_GAME = 'START_GAME';
export const THROW_YUT = 'THROW_YUT';
export const SELECT_HORSE = 'SELECT_HORSE';
export const PUT_HORSE = 'PUT_HORSE';
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
    table: [
        [1, 1, 2, 3, 4, 5] // 0
        [29, 2, 3, 4, 5, 6], // 1
        [1, 3, 4, 5, 8, 9], // 2
        [2, 4, 5, 8, 9, 10], // 3
        [3, 5, 8, 9, 10, 11], // 4
        [4, 6, 7, 26, 21, 20], // 5
        [5, 7, 26, 21, 20, 19], // 6
        [6, 26, 21, 20, 19, 22],// 7
        [5, 9, 10, 11, 12, 15],// 8
        [8, 10, 11, 12, 15, 16],// 9
        [9, 11, 12, 15, 16, 17],// 10
        [10, 12, 15, 16, 17, 18],// 11
        [11, 13, 14, 26, 27, 28],// 12
        [12, 14, 26, 27, 28, 29],// 13
        [13, 26, 27, 28, 29, 30],// 14
        [12, 16, 17, 18, 19, 22],// 15
        [15, 17, 18, 19, 22, 23],// 16
        [16, 18, 19, 22, 23, 24],// 17
        [17, 19, 22, 23, 24, 25],// 18

        // [prevValue > 15 && prevValue < 19 ? 18 : 20, 22, 23, 24, 25, 29],// 19
        [18, 22, 23, 24, 25, 29],// 19

        [21, 19, 22, 23, 24, 25],// 20
        [26, 20, 19, 22, 23, 24],// 21
        [19, 23, 24, 25, 29, 30], // 22
        [22, 24, 25, 29, 30, 30], // 23
        [23, 25, 29, 30, 30, 30], // 24
        [24, 29, 30, 30, 30, 30], // 25

        // [prevValue > 7 ? 14 : 7, 27, 28, 29, 30, 30], // 26
        [14, 27, 28, 29, 30, 30], // 26

        [26, 28, 29, 30, 30, 30], // 27
        [27, 29, 30, 30, 30, 30], // 28
        [25, 30, 30, 30, 30, 30] // 29
    ],
    boardData: {
        player1: {},
        player2: {},
        player3: {},
        player4: {},
    }, // 몇번 칸에 누구 말이 몇개 있는지 알 수 있음.
    halted: true, // 내 순서 일때 false 그 외에는 true (정지)
    yutData: [], // 윷을 던졌을때 윷 또는 모가 나오거나, 상대 말을 잡을 때 추가
    timer: 0, // 1초에 +1 씩 더해준다.
    thorw_count: 0, // 윷을 던질 수 있는 횟수를 나타냄. // halted 와 useEffect 사용해서 대체할 수 있는지 테스트 // 
    winner: [], // 이긴사람을 순서대로 추가함.
    turn: [], // 전체 차례를 받아옴.
};

const randomYut = () => {
    const res = Math.floor(Math.random() * 6, 1)
    return res;
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
    let yutData;
    let res;
    switch (action.type) {
        case UPDATE_TIMER:
            return { ...state, timer: state.timer + 1 };
        case START_GAME:
            return { ...state, winner: state.winner + 1, halted: false };
        case RESUME_GAME:
            return { ...state, halted: true };
        case THROW_YUT:
            // 윷 배열에 던져 나온 수를 추가해줌.
            yutData = [...state.yutData];
            yutData.push(randomYut);
            return { ...state, yutData };
        case PUT_HORSE:
            // 사용할 윷 데이터가 들어오면 해당 윷 데이터를 삭제
            yutData = [...state.yutData];
            res = yutData.indexOf(action.useYutData)
            delete yutData[res]
            // 말을 위치로 옴김.
            return { ...state, yutData };
        case TIME_OUT:
            // send next user
            return;
        // case SEND_GAME_DATA:

        //     return state;
        default:
            return state;
    }
}
const Styled = styled.div`
    
`;
const MineSearch = (props,) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { peerData } = useContext(PeerDataContext);
    const { boardData, halted, timer, winner } = state;

    const value = useMemo(() => ({ boardData, halted, dispatch }), [boardData, halted]);

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
    //     if (peerData.type === PEER_MINE_SEARCH) {
    //         const { tableData, data, halted } = peerData.data;
    //         dispatch({ type: "GetDataFromPeer", tableData, data, halted })
    //     }
    // }, [peerData])

    return (
        <div>
            <boardContext.Provider value={value}>
                <div>{timer}</div>
                <Yutfield />
                <div>{winner}</div>
            </boardContext.Provider>
        </div>
    )
}

export default MineSearch;
