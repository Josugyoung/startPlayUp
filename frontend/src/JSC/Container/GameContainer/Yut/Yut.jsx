import React from 'react';
import styled from 'styled-components';
import Yutfield from 'JSC/Component/GameComponent/Yut/Yutfield'
import YutPlayersSection from 'JSC/Component/GameComponent/Yut/YutPlayersSection';
import YutStore from './YutStore';

const Yut = (props) => {
    const StyleDiv = styled.div`
        display:flex;
        height:30px;
        flex-direction: column;
        margin:10px;
    `;
    return (
        <YutStore>
            <StyleDiv>
                <Yutfield />
                <YutPlayersSection />
            </StyleDiv>
        </YutStore>
    )
}

export default Yut;
