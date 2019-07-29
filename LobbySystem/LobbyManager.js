const Lobby = require('./Lobby');
const User = require('./User');

module.exports = class LobbyManager {

    constructor(io) {
        this.io = io;
        this.lobbies = [];
        this.users = [];
    }

    createLobby(id) {
        var newLobby = new Lobby(id);
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
                user.socket.emit('JoinedLobby', lobby);
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
                
                if (lobby.hasOpenSeats()) { lobby.join(user); user.socket.emit('JoinedLobby', lobby); }
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

        user.socket.emit('ExitedLobby');
        return user;
    }

    removeUserByID(userID) {
        return removeUser(this.findUser(userID));
    }

    broadcast(lobbyID, eventName, eventData) {
        this.io.to(lobbyID).broadcast(eventName, eventData);
    }

    findLobby(lobbyID) {
        return this.lobbies.find((lobby) => lobby.equalsID(lobbyID));
    }

}