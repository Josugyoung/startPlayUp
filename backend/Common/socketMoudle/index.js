module.exports = ({ io }) => {
    let roomMatchingUsers = {}
    let voiceRoomMatchingUsers = {}

    io.on('connection', socket => {
        require("./Room/room")({ io, socket, roomMatchingUsers });
        require("./Room/voiceRoom")({ io, socket, voiceRoomMatchingUsers });
        require("./chat/chat")({ io, socket });
        socket.on('disconnect', () => {
            console.log("disconnect");
            socket.broadcast.to(socket.roomID).emit("disconnect user", socket.id, socket.nickname);
            socket.broadcast.to(socket.voiceRoomID).emit("disconnect voice user", socket.id, socket.nickname);
            delete roomMatchingUsers[socket.nickname]
            delete voiceRoomMatchingUsers[socket.nickname];
            socket.leave(socket.rooms);
        });
    });
};


