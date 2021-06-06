export const getDataFromPeer = ({ peer, setPeerData }) => {
    peer.on('data', jsonData => {
        const { type, nickname, game, data } = JSON.parse(jsonData);
        console.log("getDataFromPeer", { type, nickname, game, data })
        setPeerData({ type, nickname, game, data });
    });
}