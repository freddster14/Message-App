import "dotenv/config";
import express from "express";

const app = express();

app.use(express.urlencoded({ extended: false }));


app.use('/', (req, res) => res.json("ran"))


app.listen(process.env.PORT, () => console.log(`LIVE ON PORT: ${process.env.PORT}`))