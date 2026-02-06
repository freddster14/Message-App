import express from "express";
import * as controller from "../controllers/chat.js";
import verifyToken from "../middleware/token.js";
const chat = express.Router();

chat.get('/', verifyToken, controller.chats);
chat.get('/:chatId', verifyToken, controller.chatInfo);

chat.post('/group', verifyToken, controller.group)
chat.post('/leave/:chatId', verifyToken, controller.remove)

chat.delete('/:chatId', verifyToken, controller.remove);


export default chat;