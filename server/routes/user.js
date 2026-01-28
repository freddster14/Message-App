import express from "express";
import * as controller from "../controllers/user.js";
import verifyToken from "../middleware/token.js";
const user = express.Router();

user.get('/', verifyToken, controller.user);

user.post('/update', verifyToken, controller.update)

user.delete('/', verifyToken, controller.remove);

export default user;