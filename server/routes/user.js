import express from "express";
import * as controller from "../controllers/user.js";
import verifyToken from "../middleware/token.js";
const user = express.Router();

user.get('/', verifyToken, controller.user);
user.get('/socket-token', controller.token)
user.get('/search-new/:searched', verifyToken, controller.searchNewUsers);
user.get('/friends/:chatId', verifyToken, controller.filteredFriends);
//user.get('/:id', verifyToken, controller.profile);

user.post('/update', verifyToken, controller.update);

user.delete('/', verifyToken, controller.remove);

export default user;