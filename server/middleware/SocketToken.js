import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function verifySocketToken(socket, next) {
  const stringCookies = socket.handshake.headers.cookie ?? '';
  if(stringCookies === '') return next(new Error('No cookies provided'));
  const cookies = cookie.parse(stringCookies)
  const token = cookies.token;
  if(!token) return next(new Error('No token in cookies'));

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    socket.userId = decoded.userId;
    socket.name = decoded.userName;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
}