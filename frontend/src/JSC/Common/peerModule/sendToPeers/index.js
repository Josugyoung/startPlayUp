export const sendDataToPeers = (type, { nickname, data, peers }) => {
    const js = JSON.stringify({ type, nickname, data })
    let success = false;
    try { // 
        peers === undefined || peers.forEach(p => {
            p.peer.send(js);
        });
        success = true;

    } catch (e) {
        success = false;
        console.error(e.name + ': ' + e.message)
    }
    return success
}
