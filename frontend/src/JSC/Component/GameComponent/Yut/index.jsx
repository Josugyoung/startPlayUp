import React, { useContext, useState, memo, useEffect } from 'react';
import styled from 'styled-components';

const App = () => {
    const table = [
        [12, 11, 10, 9, 8, 5],
        [13, 6],
        [15, 4],
        [14, 7],
        [16, 3],
        [26],
        [17, 2],
        [21, 27],
        [18, 1],
        [20, 28],
        [19, 22, 23, 24, 25, 29],
    ]
    const Div = styled.div`

    `;

    const Column = styled.div`
        display:flex;
        flex-direction:row;
        justify-content:space-evenly;
        margin:20px;
    `;

    const Row = styled.div`
        display:flex;
        margin:20px;
    `;


    return (
        <div>
            {table.map((i) =>
                <Column>{i.map((j) => <Row>{j}</Row>)}</Column>
            )}
        </div>

    )
}
export default memo(App);