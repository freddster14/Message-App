import jwt from "jsonwebtoken";

export default function verifySocketToken(socket, next) {
  try {
    let token = socket.handshake.auth?.token;
    // Fallback to cookie (localhost development)
    if (!token) {
      const cookieHeader = socket.handshake.headers.cookie;
      if (cookieHeader) {
        token = cookieHeader
          .split('; ')
          .find(c => c.startsWith('token='))
          ?.split('=')[1];
      }
    }
    
    if (!token) {
      return next(new Error('Authentication required'));
    }
    
    const decoded = jwt.verify(token, process.env.SECRET);
    socket.userId = decoded.userId;
    
    next();
    
  } catch (error) {
    return next(new Error('Authentication failed'));
  }
}