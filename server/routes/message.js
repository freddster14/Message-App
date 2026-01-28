import express from "express";
import * as controller from "../controllers/message.js";
import verifyToken from "../middleware/token.js";
const message = express.Router();

message.post('/', verifyToken, controller.create);


export default message;