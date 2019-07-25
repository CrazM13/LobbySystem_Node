const lobbyManagement = require("./LobbySystem/LobbyManagement");

var lobbyManager = new lobbyManagement.LobbyManager(null);

lobbyManager.createLobby("test");

lobbyManager.createUser(null);

var user = lobbyManager.joinLobby(lobbyManager.findUser(""));
console.log(user.currentLobby.id);
