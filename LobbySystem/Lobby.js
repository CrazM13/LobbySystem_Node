module.exports = class Lobby {

    constructor(id, maxUsers = 1, isPrivate = false, LobbyManager = null) {
        this.id = id;
        this.isPrivate = isPrivate;
        this.users = [];
        this.maxUsers = maxUsers;
        this.lobbyManager = LobbyManager;
    }

    setMaxUsers(value) {
        this.maxUsers = value;
    }

    hasOpenSeats() {
        return this.users.length < this.maxUsers;
    }

    join(user) {
        this.broadcast('userJoined', {userID: user.id});
        this.users.forEach((existing) => {user.socket.emit('userJoined', {userID: existing.id});});
        

        this.users.push(user);
        user.joinLobby(this);
    }

    remove(user) {
        var index = this.users.findIndex((userObj) => userObj.equals(user));

        this.users.splice(index, 1);
        user.leaveLobby();

        this.broadcast('userLeft', {userID: user.id});

        return user;
    }

    removeByID(userID) {
        var index = this.users.findIndex((userObj) => userObj.equalsID(userID));

        var user = this.users[index];

        this.users.splice(index, 1);
        user.leaveLobby();

        return user;
    }

    broadcast(eventName, eventData) {
        this.lobbyManager.broadcast(this.id, eventName, eventData);
    }

    equals(lobby) {
        return this.equalsID(lobby.id);
    }

    equalsID(lobbyID) {
        return lobbyID == this.id;
    }

}