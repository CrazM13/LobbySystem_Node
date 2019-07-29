module.exports = class User {

    constructor(socket) {
        this.socket = socket;
        this.id = socket.id;
        this.currentLobby = null;
    }

    joinLobby(lobby) {
        this.currentLobby = lobby;
        this.socket.join(lobby.id);
        return this;
    }

    leaveLobby() {
        this.currentLobby = null;
        this.socket.leave(this.currentLobby.id);
        return this;
    }

    equals(user) {
        return equalsID(user.id);
    }

    equalsID(userID) {
        return userID == this.id;
    }

}