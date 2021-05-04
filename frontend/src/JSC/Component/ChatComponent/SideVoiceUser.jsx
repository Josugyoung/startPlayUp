import React, { memo, useEffect, useRef, useState } from 'react';
import { chatAddMessage, chatAddMessageRef } from "../../Common/ChatModule/addMessage"
import styled from 'styled-components'

const ConnectUsers = styled.div`
    display:flex;
    flex-direction:column;
    flex-basis:100px;
    overflow:hidden;
    text-overflow:ellipsis;
    flex-grow:0;
`;
const Test = styled.div`
    overflow:hidden;
    text-overflow:ellipsis;
`;

const StyledAudio = styled.audio`
    height: 40%;
    width: 50%;
    display:none;
`;

// const Audio = ({ voiceRef }) => {
//     // useEffect(() => {
//     //     peer.on("stream", stream => {
//     //         console.log("asdf")
//     //         ref.current.srcObject = stream;
//     //     });
//     // }, []);
//     return (
//         <StyledAudio playsInline autoPlay ref={voiceRef} />
//     );
// }

const App = ({ peersRef, peers, voiceRef }) => {
    return (
        <ConnectUsers>
            {peers.map((i) => <Test key={i[0]}>{i[1]}{console.log("[debug] : " + i[1])}</Test>)}
            {console.log(peers)}
        </ConnectUsers>
    )
}

export default memo(App);
