import { httpServer } from "./app.js";

httpServer.listen(process.env.PORT, () => console.log(`LIVE ON PORT: ${process.env.PORT}`));