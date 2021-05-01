import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components'
import Message from './Message'
import MyTextInput from "./MyTextInput";
import Nav from "./Nav";
import { testChatList, UserContext } from "../../store";
import io from "socket.io-client";
import { chatAddMessage } from "../../Common/Chat/addMessage"
import { connectPeer } from "../../Common/peerModule"
// import { RECEIVE_MESSAGE, socketApi } from "../../Common/socketModule";
import SideVoiceUser from "./SideVoiceUser";

const TextField = styled.div`
  display:flex;
  padding:10px;
  border: rgb(0, 0, 0);
  flex-direction: column;
  overflow-y: scroll;
  height:${props => props.width || 600}px;
  width:inherit;
  border-right:3px solid #ececec;
  background-color: white;
  flex-grow:1;
  
  &::-webkit-scrollbar{
    width: 100%;
    background-color: black;
  }
`;

const Chat = styled.div`

    display:flex;
    flex-direction: column;
    height:${props => props.width || 600}px;
    width:${props => props.width || 600}px;
    border-radius: 10%;
`;

const TextFieldWithVoiceUsers = styled.div`
      background-color: white;
      width: inherit;
      display: flex;
      flex-direction: row;
`;

function Index({ backgroundColor, height, width, ...props }) {
    // socket io.connect
    const socketRef = useRef();


    const { user, isAuthenticated } = useContext(UserContext);
    // chat nickname
    const myNickName = user;
    // chat state for rerendering
    const [chatList, setChatList] = useState([]);
    let chatListRef = useRef([...chatList]);
    // scroll ref;
    const scrollRef = useRef(null);


    // peer state for rerendering
    const [peers, setPeers] = useState([]);
    let peersRef = useRef([]);
    const roomID = "9a06eb80-9fd4-11eb-a3e2-377a237cffe7";

    const scrollToBottom = () => {
        const { scrollHeight, clientHeight } = scrollRef.current;
        scrollRef.current.scrollTop = scrollHeight - clientHeight;
    };

    useEffect(() => {
        socketRef.current = io.connect("/");
        connectPeer({ socketRef, peersRef, roomID, peers, setPeers, chatList, chatListRef, setChatList, myNickname: user });

        return () => peersRef.current.forEach(i => {
            console.log("destroy peer", i);
            i.peer.removeAllListeners();
            i.peer.destroy();
        })
    }, []);


    useEffect(() => {
        scrollToBottom();
        chatListRef.current = [...chatList];
    }, [chatList]);

    return (
        <Chat width={height} height={width}>

            <Nav />
            <TextFieldWithVoiceUsers>
                <TextField className="textField" ref={scrollRef}>
                    {chatList.map((i, index) => <Message key={"chat" + index}
                        who={i.nickname === myNickName ? "me" : "another"}
                        chatObject={i} chatList={chatList} />)}
                </TextField>
                <SideVoiceUser peersRef={peersRef} peers={peers} chatList={chatList} setChatList={setChatList} />
            </TextFieldWithVoiceUsers>
            <MyTextInput peers={peers} myNickname={myNickName} chatList={chatList} setChatList={setChatList}
                socketRef={socketRef} />

        </Chat>
    );
}

export default Index;
