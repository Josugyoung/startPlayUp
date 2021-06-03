import { boardContext } from 'JSC/Container/GameContainer/Yut/YutStore';
import React, { useContext, useState, memo, useEffect } from 'react';

const App = ({ halted, name, type }) => {
    const { dispatch } = useContext(boardContext);
    const dispatchFunction = () => {
        type !== undefined && dispatch({ type });
    }
    return (
        <button disabled={halted === true && true} onClick={() => dispatchFunction()}>
            {name}
        </button >
    )
}
export default memo(App);