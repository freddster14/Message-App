import "dotenv/config";
import express from "express";
import index from "./routes";
import user from "./routes/user";
import chat from "./routes/chat";
import message from "./routes/message";
import invite from "./routes/invite";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', index);
app.use('/user', user);
app.use('/chat', chat);
app.use('/message', message);
app.use('/invite', invite);


app.listen(process.env.PORT, () => console.log(`LIVE ON PORT: ${process.env.PORT}`));