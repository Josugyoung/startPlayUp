import { THROW_YUT, START_GAME, MOVE_HORSE_USE_YUTDATA, boardContext } from 'JSC/Container/GameContainer/Yut/YutStore';
import React, { useContext, useState, memo, useEffect } from 'react';
import styled from 'styled-components';
import Horses from 'JSC/Component/GameComponent/Yut/Horses'


const StyleDiv = styled.div`
    display:flex;
    height:30px;
    flex-direction: row;
    margin:10px;
`;

const App = () => {
    const { myThrowCount, yutData, playerData, dispatch } = useContext(boardContext);
    // const [selectPlace, setSelectPlace] = useState("");
    const test = () => {
        dispatch({ type: START_GAME })
    }

    return (
        <div>
            <button onClick={test}>게임 시작</button>
            <button onClick={() => dispatch({ type: THROW_YUT })}>윷 굴리기</button>
            <button onClick={() => console.log(yutData)}>윷 데이터</button>
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
        </div>
    )
}
export default memo(App);