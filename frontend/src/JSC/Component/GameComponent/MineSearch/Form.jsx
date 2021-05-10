import React, { useCallback, useState, useContext, memo } from 'react';
import { START_GAME, TableContext } from 'JSC/Container/MineSearch';
const Form = memo(() => {
    const [row, setRow] = useState(10);
    const [cell, setCell] = useState(10);
    const [mine, setMine] = useState(20);
    const { dispatch } = useContext(TableContext);
    // const test = useContext(TableContext);
    // console.log(test);
    const onChangeRow = useCallback((e) => {
        setRow(e.target.value);
    }, []);
    const onChangeCell = useCallback((e) => {
        setCell(e.target.value);
    }, []);

    const onChangeMine = useCallback((e) => {
        if (e.target.value > row * cell) {
            setMine(parseInt(row) * parseInt(cell))
        }
        else {
            setMine(e.target.value);
        }
    }, [row, cell]);

    const onClickBtn = useCallback(() => {
        dispatch({ type: START_GAME, cell: parseInt(cell), row: parseInt(row), mine: parseInt(mine) })
    }, [cell, row, mine])


    return (
        <div>
            <input type="number" placeholder="가로" value={row} onChange={onChangeRow} />
            <input type="number" placeholder="세로" value={cell} onChange={onChangeCell} />
            <input type="number" placeholder="지뢰" value={mine} onChange={onChangeMine} />
            <button onClick={onClickBtn}>시작</button>
        </div>)
})
export default Form;