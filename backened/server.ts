import express from 'express'
import dotenv from 'dotenv'
import { dbconnect } from './config/db';
import userRouter from './routes/userRouter';
import Chatrouter from './routes/chatRouter';
import Messagerouter from './routes/messageRouter';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import Chat from './model/Chatmodel';
import uploadRouter from './controllers/upload';
const app = express()
const port = 3000

dotenv.config();
dbconnect();
app.use(express.json())

app.use("/api/user", userRouter)
app.use("/api/chat", Chatrouter)
app.use("/api/message", Messagerouter)
app.use("/api", uploadRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Connected to socket.io');
    socket.on("setup", (userData)=>{
        socket.join(userData._id);
        socket.emit('User is connected')
    })

    socket.on("joinchat",(room)=>{
        socket.join(room)
        socket.emit('User joined room',+room)
    })

    socket.on("typing",(room)=>{
        socket.in(room).emit('typing')
    })
    socket.on("stop typing",(room)=>{
        socket.in(room).emit('stop typing')
    })

    socket.on("new message",(chatData)=>{
        var chat=chatData.chat
        if(!chat.users){
            console.log('No user is there')
            return;
        }
        chat.users.foreach((user)=>{
            if(user._id!==chatData.sender._id) return;

            socket.in(user._id).emit('New message recieved', chatData)

        })
    })
    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
  });