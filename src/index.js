const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage ,generateLocationMessage} = require('./utils/messages')
const {getUser,removeUser,addUser,getUserInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//let count = 0 
//let message = null


io.on('connection', (socket) => {
    console.log('New WebSocket connection')
 
    // socket.emit('countUpdated',count)

    // socket.on('increment',()=>{
    //     count++
    //     io.emit('countUpdated',count)
    // })
   

    socket.on('join',({username,room},callback)=>{

       const {error,user} = addUser({id:socket.id,username,room })
      if(error){
          return callback(error)
      }  
   
   
       socket.join(user.room)
     socket.emit('message',generateMessage('Admin','Welcome!'))
     socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`))
     io.to(user.room).emit('roomData',{
         room: user.room,
         users : getUserInRoom(user.room)
     })
      callback()
    })
    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()
        const user = getUser(socket.id)
        



        if(filter.isProfane(message)){
            return callback('profanity is not allowed!')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        
        callback()


       
    })
    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
})
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users : getUserInRoom(user.room)
            })

        }
            })
    
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})