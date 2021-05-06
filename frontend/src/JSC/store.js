import React, { createContext, useMemo, useReducer, useState } from "react";
import { LOGIN, GET_CHATLIST, SET_CHATLIST } from './Constants/actionTypes';
import { testDB } from "./Common/TestDB";
import { Route } from 'react-router-dom';
import LoginPageContainer from "./Container/LoginPageContainer";
import ChatContainer from "./Container/ChatContainer";
import ChatComponent from "./Component/ChatComponent";
import RockPaperScissors from "./Component/GameComponent/RockPaperScissors";
import styled from 'styled-components'


const initialState = {
    user: "",
    isAuthenticated: false,
};
const reducer = (state, action) => {
    switch (action.type) {
        case LOGIN:
            const res = testDB.filter((i) => i.id === action.id && i.password === action.password);
            console.log("[DEBUG] : STORE LOGIN");
            if (res.length > 0) {
                action.history.push("/chat");
                return {
                    ...state,
                    user: res[0].nickname,
                    isAuthenticated: true
                }
            } else {
                return {
                    ...state,
                    user: "Guest"
                };
            }
        default:
            return state;
    }
};
export const UserContext = createContext({
    user: "",
    isAuthenticated: false,
    dispatch: () => { }
});

export const PeerDataContext = createContext({
    peerData: "",
    setpeerData: ""
});

export const PeersContext = createContext([]);
export const VoicePeersContext = createContext([]);


const GamePage = styled.div`
    display:flex;
    flex-direction:row;
`;

function Store() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { user, isAuthenticated } = state;
    const [peerData, setPeerData] = useState();
    const [peers, setPeers] = useState([]);
    const [voicePeers, setVoicePeers] = useState([]);
    const value = useMemo(() => ({
        user: user,
        isAuthenticated: isAuthenticated,
        dispatch: dispatch
    }), [user, isAuthenticated]);
    // dispatch는 실행중 변경하지 않기에 useMemo를 통해 제함.

    return (
        <UserContext.Provider value={value}>
            <PeerDataContext.Provider value={{ peerData, setPeerData }}>
                <PeersContext.Provider value={{ peers, setPeers }}>
                    <VoicePeersContext.Provider value={{ voicePeers, setVoicePeers }}>
                        <Route path="/" component={ChatContainer} />
                        <Route exact path="/" component={LoginPageContainer} />
                        {isAuthenticated && <Route exact path="/chat" render={() => <GamePage>
                            <RockPaperScissors />
                            <ChatComponent />
                        </GamePage>} />}
                    </VoicePeersContext.Provider>
                </PeersContext.Provider>
            </PeerDataContext.Provider>
        </UserContext.Provider >
    );
}

export default Store;
