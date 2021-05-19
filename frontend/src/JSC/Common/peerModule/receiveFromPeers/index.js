import { chatAddMessageRef } from "../../ChatModule/addMessage"
import React, { useContext } from "react";
import { PeerDataContext } from 'JSC/store'
import { PEER_ROCK_PAPER_SCISSORS, PEER_CHAT, GAME_UPDATE, GAME_DEL } from "../../../Constants/peerDataTypes";

export const getDataFromPeer = ({ peer, setPeerData }) => {
    peer.on('data', jsonData => {
        const { type, nickname, game, data } = JSON.parse(jsonData);
        console.log("getDataFromPeer", { type, nickname, game, data })
        setPeerData({ type, nickname, game, data });
    });
}