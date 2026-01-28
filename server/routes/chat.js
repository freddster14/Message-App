import express from "express";
import * as controller from "../controllers/chat.js";
import verifyToken from "../middleware/token.js";
const chat = express.Router();

chat.get('/', verifyToken, controller.chats);
chat.get('/:chatId', verifyToken, controller.chatMessages);
chat.get('/info', verifyToken, controller.info);

chat.delete('/:id', verifyToken, controller.delete);


export default chat;