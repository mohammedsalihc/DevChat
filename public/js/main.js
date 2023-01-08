const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector('.chat-messages')
const socket = io()
const roomname = document.getElementById('room-name')
const userlist = document.getElementById('users')

//Get username and room Url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true

})

//join chatroom
socket.emit('joinroom', { username, room })

//get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})



//message from server
socket.on('message', message => {
    outputmessage(message)
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //Get message text
    const msg = e.target.elements.msg.value
    //Emit message to server
    socket.emit("chatMessage", msg)
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()
})


outputmessage = (message) => {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}


//add room name to DOM

outputRoomName = (room) => {
    roomname.innerText = room
}

outputUsers = (users) => {
    userlist.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join("")}`
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });