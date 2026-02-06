import { httpServer } from "./app";

httpServer.listen(process.env.PORT, () => console.log(`LIVE ON PORT: ${process.env.PORT}`));