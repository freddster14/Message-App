import express from "express";
import * as controller from "../controllers/index.js";
const index = express.Router();


index.post('/sign-in', controller.signIn);
index.post('/sign-up', controller.signUp);
index.get('/me', controller.me);

export default index;