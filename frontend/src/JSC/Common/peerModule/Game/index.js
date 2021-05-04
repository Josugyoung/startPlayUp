import { chatAddMessageRef } from "./../../ChatModule/addMessage"

export const getDataFromPeerOn = ({ peer, chatListRef, setChatList, setPeerData }) => {
    peer.on('data', jsonData => {
        const { type, nickname, data } = JSON.parse(jsonData)
        switch (type) {
            case "chat":
                chatAddMessageRef({ nickname, inputMessage: data, chatListRef, setChatList });
                break;
            case "RockPaperScissors":
                setPeerData(data);
                break;
            default:
                return;
        }
    });
}