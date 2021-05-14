import { chatAddMessageRef } from "../../ChatModule/addMessage"
import React, { useContext } from "react";
import { PeerDataContext } from 'JSC/store'
import { PEER_ROCK_PAPER_SCISSORS, PEER_CHAT, GAME_UPDATE, GAME_DEL } from "../../../Constants/peerDataTypes";

export const getDataFromPeer = ({ peer, setPeerData }) => {
    // const { setPeerData } = useContext(PeerDataContext);
    peer.on('data', jsonData => {
        const { type, nickname, data } = JSON.parse(jsonData)
        setPeerData({ type, nickname, data });
    });
}