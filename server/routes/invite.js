import express from "express";
import * as controller from "../controllers/invite.js";
import verifyToken from "../middleware/token.js";
const invite = express.Router();

invite.get('/received', verifyToken, controller.received);
invite.get('/sent', verifyToken, controller.sent);

invite.post('/', verifyToken, controller.create);
invite.post('/accept', verifyToken, controller.accept);

invite.delete('/decline', verifyToken, controller.decline)
invite.delete('/delete', verifyToken, controller.remove)

export default invite;