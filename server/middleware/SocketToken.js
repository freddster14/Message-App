import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function verifySocketToken(socket, next) {
  console.log('========== SOCKET AUTH DEBUG ==========');
  console.log('Headers:', JSON.stringify(socket.handshake.headers, null, 2));
  console.log('Auth:', socket.handshake.auth);
  console.log('Query:', socket.handshake.query);
  
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    console.log('Cookie header:', cookieHeader);
    
    if (!cookieHeader) {
      console.log('❌ No cookie header present');
      return next(new Error('No cookie'));
    }
    
    const token = cookieHeader
      .split('; ')
      .find(c => c.startsWith('token='))
      ?.split('=')[1];
    
    console.log('Extracted token:', token ? 'EXISTS' : 'NOT FOUND');
    
    if (!token) {
      console.log('❌ No token in cookie');
      return next(new Error('No token'));
    }
    
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
};