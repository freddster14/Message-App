import express from "express";
import * as controller from "../controllers/index.js";
import verifyToken from "../middleware/token.js";
const index = express.Router();


index.post('/sign-in', controller.signIn);
index.post('/sign-up', controller.signUp);
index.post('/later', verifyToken, controller.later);

export default index;