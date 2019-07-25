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
                // EVENT "JoinedLobby"
                return user;
            }
        }

        // EVENT "JoinFailed"
        return user;
    }

    joinLobbybyID(id, user) {
        for (var i = 0; i < this.lobbies.length; i++) {
            var lobby = this.lobbies[i];

            if (lobby.id == id) {
                
                if (lobby.hasOpenSeats()) lobby.join(user);
                //else //EVENT "JoinFailed"

                return user;
            }
        }

        // EVENT "JoinFailed"
        return user;
    }

    removeUser(user) {
        var lobby = user.currentLobby;

        if (lobby != null) {
            lobby.remove(user);
            user.currentLobby = null;
        }

        // EVENT "ExitedLobby"
        return user;
    }

    removeUserByID(userID) {
        return removeUser(this.findUser(userID));
    }

    broadcast(lobbyID, eventName, eventData) {
        // TODO
    }

    findLobby(lobbyID) {
        return this.lobbies.find((lobby) => lobby.equalsID(lobbyID));
    }

}