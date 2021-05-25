import { THROW_YUT, SELECT_HORSE, MOVE_HORSE, boardContext } from 'JSC/Container/GameContainer/Yut';
import React, { useContext, useState, memo, useEffect } from 'react';
import styled from 'styled-components';

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
    cursor:${props => props.color !== undefined && props.color};
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
    // const gridTable = [
    //     { row: 20, column: 20 }, // 0
    //     { row: 20, column: 16 }, // 1
    //     { row: 20, column: 12 }, // 2
    //     { row: 20, column: 8 }, // 3
    //     { row: 20, column: 4 }, // 4
    //     { row: 20, column: 0 }, // 5
    //     { row: 16, column: 4 }, // 6
    //     { row: 13, column: 7 }, // 7
    //     { row: 16, column: 0 }, // 8
    //     { row: 12, column: 0 }, // 9
    //     { row: 8, column: 0 }, // 10
    //     { row: 4, column: 0 }, // 11
    //     { row: 0, column: 0 }, // 12
    //     { row: 4, column: 4 }, // 13
    //     { row: 7, column: 7 }, // 14
    //     { row: 0, column: 4 }, // 15
    //     { row: 0, column: 8 }, // 16
    //     { row: 0, column: 12 }, // 17
    //     { row: 0, column: 16 }, // 18
    //     { row: 0, column: 20 }, // 19
    //     { row: 4, column: 16 }, // 20
    //     { row: 7, column: 13 }, // 21
    //     { row: 4, column: 20 }, // 22
    //     { row: 8, column: 20 }, // 23
    //     { row: 12, column: 20 }, // 24
    //     { row: 16, column: 20 }, // 25
    //     { row: 10, column: 10 }, // 26
    //     { row: 13, column: 13 }, // 27
    //     { row: 16, column: 16 }, // 28
    //     { row: 20, column: 20 }, // 29
    //     { row: 16, column: 10 }, // 30
    // ]

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
    ]
    const { table, yutData, placeToMove, dispatch } = useContext(boardContext);
    // const [selectPlace, setSelectPlace] = useState("");
    const clickHorseHandler = (index) => (e) => {
        e.preventDefault();
        dispatch({ type: SELECT_HORSE, index })
        // console.log("[debug] : ", index, table[index]);
    }
    const changeItemColorHandler = (index) => {
        return placeToMove.includes(index) && 'yellow'
    }
    const includesPlaceToMove = (index) => placeToMove.includes(index)

    const moveHorse = (index) => (e) => {
        e.preventDefault();
        dispatch({ type: MOVE_HORSE, index });
    }
    return (
        <div>
            <GridContainer class="container">
                {gridTable.map((i, index) =>
                    <GridPlace index={i.index} row={i.column} column={i.row}>
                        <PlaceButton onclick={() => moveHorse(i.index)} color={changeItemColorHandler(i.index)}>{i.index}</PlaceButton>
                    </GridPlace>)
                }
            </GridContainer >
        </div>
    )
}
export default memo(App);