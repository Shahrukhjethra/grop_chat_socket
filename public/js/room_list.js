const roomList = document.getElementById('room');

const socket = io();

// get room list 
socket.on('roomsList', (roomList) => {
    outputRooms(roomList);
});



// Add room to DOM
function outputRooms(room) {
   console.log("room", room);   
    roomList.innerHTML = `
      ${room.map(room => `<option value=${room.group_id}>${room.groupname}</option>`).join('')}
    `;
}    