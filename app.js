const port = process.env.PORT || 1222

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const router = express.Router();
const io = require('socket.io')(server);
const lobbyManagement = require("./LobbySystem/LobbyManagement");

var lobbyManager = new lobbyManagement.LobbyManager(io);

io.on('connection', (socket) => {

	const user = lobbyManager.createUser(socket);
	socket.emit('connection');

	socket.on('findLobby', (data) => {
		if (data && data.lobbyID) {
			lobbyManager.joinLobbybyID(data.lobbyID, user);
		} else {
			lobbyManager.joinLobby(user);
		}
	});

	socket.on('leaveLobby', (data) => {
		lobbyManager.removeUser(user);
	});

	socket.on('createLobby', (data) => {
		var lobby = lobbyManager.createLobby(data.lobbyID, data.maxUsers, data.isPrivate);
		lobby.join(user);
		socket.emit('JoinedLobby', {lobbyID: lobby.id});
	});

	socket.on('disconnect', () => {
		var lobby = user.currentLobby;
		lobbyManager.removeUser(user);
		if (lobby && lobby.users.length <= 0) lobbyManager.removeLobby(lobby);
	});

	socket.on('movedMouse', (data) => {
		if (user.currentLobby) user.currentLobby.broadcast('movedMouse', {userID: user.id, x: data.x, y: data.y});
	});

});

router.get('/', (req, res) => {
	res.render('index');
});

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

app.use('/', router);
server.listen(port, () => {
	console.log(`Server on port ${port}`);
})
