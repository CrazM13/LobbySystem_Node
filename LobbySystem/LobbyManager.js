const Lobby = require('./Lobby');
const User = require('./User');

module.exports = class LobbyManager {

    constructor(io) {
        this.io = io;
        this.lobbies = [];
        this.users = [];
    }

    createLobby(id, maxUsers = 1, isPrivate = false) {
        var newLobby = new Lobby(id, maxUsers, isPrivate, this);
        this.lobbies.push(newLobby);
        return newLobby;
    }

    createUser(socket) {
        var newUser = new User(socket);
        this.users.push(newUser);
        return newUser;
    }

    findUser(userID) {
        return this.users.find((user) => user.equalsID(userID));
    }

    joinLobby(user) {
        for (var i = 0; i < this.lobbies.length; i++) {
            var lobby = this.lobbies[i];

            if (!lobby.isPrivate && lobby.hasOpenSeats()) {
                lobby.join(user);
                user.socket.emit('JoinedLobby', {lobbyID: lobby.id});
                return user;
            }
        }

        user.socket.emit('JoinFailed', {err: "No Open Lobbies Found"});
        return user;
    }

    joinLobbybyID(id, user) {
        for (var i = 0; i < this.lobbies.length; i++) {
            var lobby = this.lobbies[i];

            if (lobby.id == id) {
                
                if (lobby.hasOpenSeats()) { lobby.join(user); user.socket.emit('JoinedLobby', {lobbyID: lobby.id}); }
                else user.socket.emit('JoinFailed', {err: "The Lobby Is Full"});

                return user;
            }
        }

        user.socket.emit('JoinFailed', {err: `No Lobbies With ID ${id} Found`});
        return user;
    }

    removeUser(user) {
        var lobby = user.currentLobby;

        if (lobby != null) {
            lobby.remove(user);
            user.currentLobby = null;
        }

        user.socket.emit('ExitedLobby', {lobbyID: lobby ? lobby.id : ""});
        return user;
    }

    removeUserByID(userID) {
        return removeUser(this.findUser(userID));
    }

    broadcast(lobbyID, eventName, eventData) {
        this.io.to(lobbyID).emit(eventName, eventData);
    }

    findLobby(lobbyID) {
        return this.lobbies.find((lobby) => lobby.equalsID(lobbyID));
    }

    removeLobby(lobby) {
        var index = this.lobbies.findIndex((lobbyObj) => lobbyObj.equals(lobby));

        this.lobbies.splice(index, 1);
    }

}