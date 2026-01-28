import express from "express";
import * as controller from "../controllers/user.js";
import verifyToken from "../middleware/token.js";
const user = express.Router();

user.get('/', controller.user);

user.post('/', controller.create);

user.delete('/:id', verifyToken, controller.delete);

export default user;