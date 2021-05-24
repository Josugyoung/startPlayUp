import { THROW_YUT } from 'JSC/Container/Yut';
import { SELECT_HORSE } from 'JSC/Container/Yut';
import { boardContext } from 'JSC/Container/Yut';
import React, { useContext, useState, memo, useEffect } from 'react';
import styled from 'styled-components';


const Horse = styled.button`
        display:flex;
        flex-direction: row;
        width:20px;
        height:20px;
        background-color:${props => props.color !== undefined && props.color};
        border-radius: 100%;
        border: solid 1px black;
        cursor:pointer;
        margin:10px;
        z-index:${props => props.index};
        position:absolute;
        transform: ${props => "translateX(" + props.index * 10 + "px)"};
         
    `;

const StyledButton = styled.button`
    border:0;
    outline:0;
`;


const App = ({ horses, color }) => {
    const { dispatch, table } = useContext(boardContext);
    const clickHorseHandler = (index) => (e) => {
        e.preventDefault();
        dispatch({ type: SELECT_HORSE, index })
        console.log("[debug] : ", index, table[index]);
    }
    return (
        <div>
            <div onClick={clickHorseHandler(0)} >
                {[...Array(horses)].map((tp, index) =>
                    <Horse key={index} color={color} index={index} />
                )}
            </div>
        </div>
    )
}
export default memo(App);