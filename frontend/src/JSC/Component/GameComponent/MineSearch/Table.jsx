import React, { useContext, memo } from 'react';
import Tr from './Tr';
import { TableContext } from 'JSC/Container/MineSearch';
import styled from "styled-components";

const StyledTable = styled.table`
    width:400px;
    height:400px;
`;

const StyledTbody = styled.tbody`

`;


const Table = memo(() => {
    const { tableData } = useContext(TableContext);
    return (
        <StyledTable>
            <StyledTbody className="main_board">
                {Array(tableData.length).fill().map((tr, i) => <Tr key={i} rowIndex={i} />)}
            </StyledTbody>
        </StyledTable>
    )
})

export default Table;