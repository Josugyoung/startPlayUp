module.exports = ({ io, socket }) => {
    let currentRoomId;
    socket.on("join room", roomID => {
        currentRoomId = roomID;
        let setUsersInThisRoom = io.sockets.adapter.rooms.get(roomID);
        let usersInThisRoom = setUsersInThisRoom === undefined ? [] : Array.from(setUsersInThisRoom);
        socket.join(roomID);
        console.log("join room");
        socket.emit("all users", usersInThisRoom); // Set으로 받아오기에 값을 array로 바꿔줬음.
    });

    socket.on("sending signal", ({ signal, callerID, userToSignal, myNickname }) => {
        console.log("sending signal");
        io.to(userToSignal).emit('user joined', { signal, callerID, peerNickname: myNickname });
    });

    socket.on("returning signal", ({ callerID, signal, nickname, myNickname }) => {
        console.log("returning signal");
        io.to(callerID).emit('receiving returned signal', { signal: signal, id: socket.id, peerNickname: myNickname });
    });

    socket.on('disconnect', () => {
        console.log("diconnect");
        socket.broadcast.to(currentRoomId).emit("disconnect user", socket.id);
        socket.leave(socket.rooms);
    });
};
