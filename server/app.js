import "dotenv/config";
import express from "express";
import cors from "cors"
import index from "./routes/index.js";
import user from "./routes/user.js";
import chat from "./routes/chat.js";
import message from "./routes/message.js";
import invite from "./routes/invite.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import verifySocketToken from "./middleware/SocketToken.js";
import { prisma } from "./prisma/client.js";

export const app = express();
const httpServer = createServer(app) ;


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', index);
app.use('/user', user);
app.use('/chat', chat);
app.use('/message', message);
app.use('/invite', invite);


const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true, 
  pingTimeout: 60000,
  pingInterval: 25000
});


io.use(verifySocketToken)

io.on("connection", (socket) => {
  // console.log("a user connected", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(`chat${chatId}`);
    //console.log(`user ${socket.id} joined chat${chatId}`)
  });

  socket.on('send_message', async (msg, chatId) => {
    const message = await prisma.message.create({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        },
      },
      data: {
        text: msg,
        authorId: socket.userId,
        chatId: chatId,
      }
    })
    // console.log(`chat${chatId}`, msg, chatId);
    // console.log(socket.rooms)
    socket.to(`chat${chatId}`).emit('new_message', { message });
  })

  socket.on('leave_chat', (chatId) => {
    socket.leave(`chat${chatId}`);
    // console.log(`user ${socket.id} left chat${chatId}`)
  })
  socket.on("disconnect", (reason) => {
    // console.log("a user disconnected")
  })
})

export { httpServer }