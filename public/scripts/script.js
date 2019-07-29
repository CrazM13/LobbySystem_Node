const socket = io();

socket.on('connection', () => {
    document.getElementById("connected_message").innerHTML = `CONNECTED WITHOUT LOBBY`;
    $("#lobbyMenuDisconnected").show();
    $("#lobbyMenuConnected").hide();
});

socket.on('JoinedLobby', (data) => {
    document.getElementById("connected_message").innerHTML = `CONNECTED TO ${data.lobbyID}`;
    $("#lobbyMenuDisconnected").hide();
    $("#lobbyMenuConnected").show();
});

socket.on('ExitedLobby', (data) => {
    document.getElementById("connected_message").innerHTML = `DISCONNECTED FROM ${data.lobbyID}`;
    $("#lobbyMenuDisconnected").show();
    $("#lobbyMenuConnected").hide();

    $("#cursors").children().remove();
});

socket.on('JoinFailed', (data) => {
    console.log(data.err);
});

socket.on('userJoined', (data) => {
    console.log(data.userID);
    $('#cursors').append(`<img id="user_${data.userID}" class="cursor" src="./images/cursor.png" style="width: 16px; height: 16px;" />`);
});

socket.on('userLeft', (data) => {
    console.log(data.userID);
    $(`#user_${data.userID}`).remove();
});

socket.on('movedMouse', (data) => {
    $(`#user_${data.userID}`).css({
        position: 'absolute',
        left: data.x,
        top: data.y
    });
});

function createLobbyOnClick() {

    var lobbyID = $("#lobbyIDInput").val();
    var maxUsers = parseInt($("#maxUsersInput").val());
    var isPrivate = $("#isPrivateLobby").is(":checked");

    console.log({lobbyID: lobbyID, maxUsers: maxUsers, isPrivate: isPrivate});

    socket.emit('createLobby', {lobbyID: lobbyID, maxUsers: maxUsers, isPrivate: isPrivate});
}

function findLobbyOnClick() {
    socket.emit('findLobby');
}

function findLobbyByIDOnClick() {
    socket.emit('findLobby', {lobbyID: $("#lobbyIDSearchInput").val()});
}

function disconnectOnClick() {
    socket.emit('leaveLobby');
}

$(document).mousemove((event) => {
    socket.emit('movedMouse', {x: event.pageX, y: event.pageY});
});