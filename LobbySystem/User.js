module.exports = class User {

    constructor(socket) {
        this.socket = socket;
        this.id = socket.id;
        this.currentLobby = null;
    }

    joinLobby(lobby) {
        this.currentLobby = lobby;
        return this;
    }

    leaveLobby() {
        this.currentLobby = null;
        return this;
    }

    equals(user) {
        return equalsID(user.id);
    }

    equalsID(userID) {
        return userID == this.id;
    }

}