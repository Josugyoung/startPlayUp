import React, { memo, useEffect, useRef, useState } from 'react';
import { chatAddMessage, chatAddMessageRef } from "../../Common/Chat/addMessage"
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
`;

const Audio = ({ peer }) => {
    const ref = useRef();
    useEffect(() => {
        peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
    }, []);

    return (
        <StyledAudio playsInline autoPlay ref={ref} />
    );
}

const App = ({ peersRef, peers, chatList, setChatList }) => {
    return (
        <ConnectUsers>
            {peersRef.current.map((i) => <Test key={i.peerID}>{i.nickname}{console.log("[debug] : " + i.nickname)
            }</Test>)}
            {peers.map((i, index) => (
                <Audio key={"" + i._id + i.localAddress + i.localPort} peer={i} />
            ))}
            {console.log(peers)}
        </ConnectUsers>
    )
}

export default memo(App);
