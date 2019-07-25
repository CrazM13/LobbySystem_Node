const io = require('socket.io')(process.env.PORT || 1222);
const lobbyManagement = require("./LobbySystem/LobbyManagement");

var lobbyManager = new lobbyManagement.LobbyManager(io);

io.on('connection', (socket) => {

    const user = lobbyManager.createUser(socket);

    console.log(user.id);

});
