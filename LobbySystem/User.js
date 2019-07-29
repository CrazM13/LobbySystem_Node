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
        if (this.currentLobby) this.socket.leave(this.currentLobby.id);
        this.currentLobby = null;
        return this;
    }

    equals(user) {
        return this.equalsID(user.id);
    }

    equalsID(userID) {
        return userID == this.id;
    }

}