import Peer from "simple-peer";
import { getDataFromPeerOn } from "../receiveFromPeers"

export const connectPeer = ({ socketRef, roomID, peersRef, setPeers, chatListRef, setChatList, myNickname, setPeerData }) => {
    socketRef.current.emit("join room", roomID);
    socketRef.current.on("all users", users => {
        const peers = [];
        users.forEach(userID => {
            const peer = createPeer(userID, socketRef.current.id);
            peersRef.current.push({
                peerID: userID,
                peer,
                nickname: "",
            });
            peers.push({ peer, nickname: "연결중" });
        });
        setPeers(peers);
    });

    socketRef.current.on("user joined", ({ signal, callerID, peerNickname }) => {
        const peer = addPeer(signal, callerID);
        peersRef.current.push({
            peerID: callerID,
            peer,
            nickname: peerNickname,
        })
        console.log("[debug : addPeer : ", peersRef.current);
        setPeers(peersRef.current.map((i) => ({ peer: i.peer, nickname: i.nickname })));
    });

    socketRef.current.on("receiving returned signal", ({ id, signal, peerNickname }) => {
        const item = peersRef.current.find(p => p.peerID === id);
        item.peer.signal(signal);
        item.nickname = peerNickname;
        setPeers(peersRef.current.map((i) => ({ peer: i.peer, nickname: i.nickname })));
        console.log("receiving returned signal", peerNickname);
    });

    socketRef.current.on("disconnect user", (socketID) => {
        console.log(socketID);
        console.log("disconnect user : ", peersRef.current);
        peersRef.current = peersRef.current.filter((i) => i.peerID !== socketID)
        console.log("disconnect user : ", peersRef.current);
        setPeers(peersRef.current.map((i) => ({ peer: i.peer, nickname: i.nickname })));
    });
    function createPeer(userToSignal, callerID) {
        //처음 webrtc를 연결할 때 이미 방에 연결되어있는 피어 추가
        const peer = new Peer({
            initiator: true,
            trickle: false,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal, myNickname })
        })
        getDataFromPeerOn({ peer, chatListRef, setChatList, setPeerData });
        return peer;
    }

    function addPeer(incomingSignal, callerID) {
        // webrtc연결 후 추가적인 인원이 들어올때 피어 추가
        const peer = new Peer({
            initiator: false,
            trickle: false,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID, myNickname })
        });

        peer.signal(incomingSignal);
        getDataFromPeerOn({ peer, chatListRef, setChatList, setPeerData });
        return peer;
    }
}

// ------------------------------------------------------------------------------------------------------


    // navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
    //     socketRef.current.emit("join room", roomID);
    //     socketRef.current.on("all users", users => {
    //         const peers = [];
    //         users.forEach(userID => {
    //             const peer = createPeer(userID, socketRef.current.id, stream);
    //             peersRef.current.push({
    //                 peerID: userID,
    //                 peer,
    //                 nickname: "",
    //             });
    //             peers.push({ peer, nickname: "연결중" });
    //         });
    //         setPeers(peers);
    //     });

    //     socketRef.current.on("user joined", ({ signal, callerID, peerNickname }) => {
    //         const peer = addPeer(signal, callerID, stream);
    //         peersRef.current.push({
    //             peerID: callerID,
    //             peer,
    //             nickname: peerNickname,
    //         })
    //         console.log("[debug : addPeer : ", peersRef.current);
    //         setPeers(peersRef.current.map((i) => ({ peer: i.peer, nickname: i.nickname })));
    //     });

    //     socketRef.current.on("receiving returned signal", ({ id, signal, peerNickname }) => {
    //         const item = peersRef.current.find(p => p.peerID === id);
    //         item.peer.signal(signal);
    //         item.nickname = peerNickname;
    //         setPeers(peersRef.current.map((i) => ({ peer: i.peer, nickname: i.nickname })));
    //         console.log("receiving returned signal", peerNickname);
    //     });

    //     socketRef.current.on("disconnect user", (socketID) => {
    //         console.log(socketID);
    //         console.log("disconnect user : ", peersRef.current);
    //         peersRef.current = peersRef.current.filter((i) => i.peerID !== socketID)
    //         console.log("disconnect user : ", peersRef.current);
    //         setPeers(peersRef.current.map((i) => ({ peer: i.peer, nickname: i.nickname })));
    //     });

    // }).catch((e) => console.log(e));

//     function createPeer(userToSignal, callerID, stream) {
//         //처음 webrtc를 연결할 때 이미 방에 연결되어있는 피어 추가
//         const peer = new Peer({
//             initiator: true,
//             trickle: false,
//             stream,
//         });

//         peer.on("signal", signal => {
//             socketRef.current.emit("sending signal", { userToSignal, callerID, signal, myNickname })
//         })
//         //connectVoiceRef({ peer, voiceRef });
//         getDataFromPeerOn({ peer, chatListRef, setChatList, voiceRef, setPeerData });
//         return peer;
//     }

//     function addPeer(incomingSignal, callerID, stream) {
//         // webrtc연결 후 추가적인 인원이 들어올때 피어 추가
//         const peer = new Peer({
//             initiator: false,
//             trickle: false,
//             stream,
//         });

//         peer.on("signal", signal => {
//             socketRef.current.emit("returning signal", { signal, callerID, myNickname })
//         });

//         peer.signal(incomingSignal);
//         //connectVoiceRef({ peer, voiceRef });
//         getDataFromPeerOn({ peer, chatListRef, setChatList, voiceRef, setPeerData });
//         return peer;
//     }

//     const connectVoiceRef = ({ peer, voiceRef }) => {
//         // 음성 채팅 추가 부분. 
//         peer.on("stream", stream => {
//             console.log("[debug] : voiceRef");
//             if ("srcObject" in voiceRef.current) {
//                 console.log("voiceRef", voiceRef.current)
//                 voiceRef.current.srcObject = stream;
//             }
//         });
//     }
// }


