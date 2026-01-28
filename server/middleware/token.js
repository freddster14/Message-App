import { verify } from "jsonwebtoken";

export default function verifyToken() {
  // extract token from request
  // then verify it
  // attach to req.user
  const token = req.cookies.token || "";
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = verify(token, process.env.SECRET);
    req.user = { id: decoded.userId, name: decoded.userName };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}