import { THROW_YUT, MOVE_HORSE, MOVE_FIRST_HORSE, boardContext } from 'JSC/Container/GameContainer/Yut';
import React, { useContext, useState, memo, useEffect } from 'react';
import styled from 'styled-components';
import Horses from 'JSC/Component/GameComponent/Yut/Horses'

const GridContainer = styled.div`
    /* width:300px;
    height:300px; */
    display:grid;
    grid-gap: 2px;
    grid-template-rows:repeat(21,0.4fr);
    grid-template-columns:repeat(21,0.4fr);
`;

const GridPlace = styled.div`
    display:grid;
    grid-row:${props => String(props.row + 1) + " / " + String(props.row + 2)};
    grid-column:${props => String(props.column + 1) + " / " + String(props.column + 2)};
`;

const PlaceButton = styled.button`
    background-color:${props => props.color !== undefined && props.color};
    border-radius: 100%;
    border: solid 1px black;
    padding:10px;
    ${props => props.color !== undefined && "cursor:pointer;"};
    /* top: 40px;
    left: 40px; */
`;

const HorseButton = styled.button`
    background-color:${props => props.color !== undefined && props.color};
    border-radius: 100%;
    border: solid 1px black;
    padding:10px;
    cursor:pointer;
    /* top: 40px;
    left: 40px; */
`;

const App = () => {
    const gridTable = [
        { index: 40, row: 20, column: 20 },
        { index: 2, row: 20, column: 16 },
        { index: 4, row: 20, column: 12 },
        { index: 6, row: 20, column: 8 },
        { index: 8, row: 20, column: 4 },
        { index: 10, row: 20, column: 0 },
        { index: 11, row: 16, column: 4 },
        { index: 13, row: 13, column: 7 },
        { index: 12, row: 16, column: 0 },
        { index: 14, row: 12, column: 0 },
        { index: 16, row: 8, column: 0 },
        { index: 18, row: 4, column: 0 },
        { index: 20, row: 0, column: 0 },
        { index: 21, row: 4, column: 4 },
        { index: 23, row: 7, column: 7 },
        { index: 22, row: 0, column: 4 },
        { index: 24, row: 0, column: 8 },
        { index: 26, row: 0, column: 12 },
        { index: 28, row: 0, column: 16 },
        { index: 30, row: 0, column: 20 },
        { index: 29, row: 4, column: 16 },
        { index: 27, row: 7, column: 13 },
        { index: 32, row: 4, column: 20 },
        { index: 34, row: 8, column: 20 },
        { index: 36, row: 12, column: 20 },
        { index: 38, row: 16, column: 20 },
        { index: 25, row: 10, column: 10 },
        { index: 37, row: 13, column: 13 },
        { index: 39, row: 16, column: 16 },
        { index: 40, row: 20, column: 20 },
        { index: 42, row: 16, column: 10 },
    ]
    const { table, selectHorse, yutData, playerData, horsePosition, placeToMove, dispatch } = useContext(boardContext);
    // const [selectPlace, setSelectPlace] = useState("");
    const clickHorseHandler = (index) => (e) => {
        e.preventDefault();
        dispatch({ type: SELECT_HORSE, index })
        // console.log("[debug] : ", index, table[index]);
    }
    const changeItemColorHandler = (index) => {
        // return placeToMove.map((i) => i.index).includes(index) ? 'yellow' : 'white'
        // change placeToMove index를 앞으로 빼서 key 값으로 바꿈.
        return Object.keys(placeToMove).includes(String(index)) ? 'yellow' : 'white'

    }
    const moveHorse = (e, index) => {
        e.preventDefault();
        if (selectHorse === 0) {
            console.log("MOVE_FIRST_HORSE")
            dispatch({ type: MOVE_FIRST_HORSE, index })
        }
        else {
            console.log("MOVE_HORSE")
            dispatch({ type: MOVE_HORSE, index });
        }
    }
    const test = () => {
        console.log("test");
    }
    return (
        <div>
            <GridContainer className="container">
                {gridTable.map((i, index) =>
                    <GridPlace key={index} index={i.index} row={i.column} column={i.row}>
                        <PlaceButton key={index} onClick={(e) => moveHorse(e, i.index)} color={changeItemColorHandler(i.index)}>{i.index}</PlaceButton>
                        {horsePosition[i.index] !== undefined &&
                            <Horses color={playerData[horsePosition[i.index]['player']]['color']} index={i.index} horses={horsePosition[i.index]['horses']}>
                                {i.index}
                            </Horses>}
                    </GridPlace>)
                }
            </GridContainer >
        </div>
    )
}
export default memo(App);