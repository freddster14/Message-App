import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const token = req.cookies.token || "";
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = { id: decoded.userId, name: decoded.userName };
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
}