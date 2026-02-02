import "dotenv/config";
import express from "express";
import cors from "cors"
import index from "./routes/index.js";
import user from "./routes/user.js";
import chat from "./routes/chat.js";
import message from "./routes/message.js";
import invite from "./routes/invite.js";
import cookieParser from "cookie-parser";

const app = express();

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


app.listen(process.env.PORT, () => console.log(`LIVE ON PORT: ${process.env.PORT}`));