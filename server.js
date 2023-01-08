const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessages = require('./utils/Messages')
const { userJoin, getCurrentUser, userLeave, getRoomusers } = require('./utils/users')



const app = express()
const server = http.createServer(app)
const io = socketio(server)
const botName = "DevChatbot"






app.use(express.static(path.join(__dirname, "public")))

io.on('connection', socket => {

    socket.on('joinroom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)


        //welcome current user
        socket.emit("message", formatMessages(botName, "welcome to devchat"))


        //Broadcast when user connect
        socket.broadcast.to(user.room).emit('message', formatMessages(botName, `${user.username} has joined the chat`))


        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomusers(user.room)
        })
    })



    //listen for chatMessage

    socket.on("chatMessage", (message) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessages(user.username, message))
    })
    //Run when client disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessages(botName, `${user.username} has left the chat`))
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomusers(user.room)
            })
        }

    })
})




const PORT = 3000
server.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})