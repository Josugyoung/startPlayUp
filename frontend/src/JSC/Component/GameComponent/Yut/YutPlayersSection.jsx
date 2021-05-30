import { THROW_YUT, START_GAME, MOVE_HORSE_USE_YUTDATA, boardContext } from 'JSC/Container/GameContainer/Yut/YutStore';
import React, { useContext, useState, memo, useEffect } from 'react';
import styled from 'styled-components';
import Horses from 'JSC/Component/GameComponent/Yut/Horses'
import { NEXT_TURN } from 'JSC/Container/GameContainer/Yut/YutStore';
import HaltButton from './HaltButton';


const StyleDiv = styled.div`
    display:flex;
    height:30px;
    flex-direction: row;
    margin:10px;
`;

const App = () => {
    const { myThrowCount, yutData, playerData, nowTurn, dispatch, halted } = useContext(boardContext);
    return (
        <div>
            <button onClick={() => dispatch({ type: START_GAME })}>게임 시작</button>
            <HaltButton type={THROW_YUT} halted={halted} name={'윷 굴리기'} />
            <HaltButton onClick={() => console.log(yutData)} halted={halted} name={'윷 데이터'} />
            {/* <HaltButton onClick={() => dispatch({ type: THROW_YUT })}>윷 굴리기</HaltButton>
            <HaltButton onClick={() => console.log(yutData)}>윷 데이터</HaltButton> */}
            <button onClick={() => dispatch({ type: NEXT_TURN })}>다음 턴</button>
            <div>nowTurn : {nowTurn}</div>
            <div>{playerData[nowTurn].nickname}</div>
            <StyleDiv>말이 갈 수 있는 수 :
                {
                    yutData.map((i, index) => <button key={index} onClick={() => dispatch({ type: MOVE_HORSE_USE_YUTDATA })}> {i} </button>)
                }
            </StyleDiv>
            <div>윷 던질 수 있는 횟수 : {myThrowCount}</div>
            <div>
                {playerData.map((i, index) => <div key={index}>
                    <div>닉네임 : {i.nickname}</div>
                    <div style={{ "height": "60px" }} >
                        말의 갯수 :
                        <Horses color={i.color} index={0} horses={i.horses} />
                    </div>
                    <div>얻은 점수 : {i.goal}</div>
                    <p />
                </div>)}
            </div>
        </div >
    )
}
export default memo(App);