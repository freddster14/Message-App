import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function verifySocketToken(socket, next) {
  console.log('========== SOCKET AUTH DEBUG ==========');
  console.log('Auth:', socket.handshake.auth);
  console.log('Cookie header:', socket.handshake.headers.cookie);
  
  try {
    // Check auth.token FIRST (production cross-origin)
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
      console.log('❌ No token in auth or cookie');
      return next(new Error('Authentication required'));
    }
    
    console.log('✅ Token found in:', socket.handshake.auth?.token ? 'auth' : 'cookie');
    
    const decoded = jwt.verify(token, process.env.SECRET);
    socket.userId = decoded.userId;
    
    console.log('✅ Socket authenticated:', socket.userId);
    console.log('=======================================');
    next();
    
  } catch (error) {
    console.error('❌ Socket auth error:', error.message);
    console.log('=======================================');
    return next(new Error('Authentication failed'));
  }
}