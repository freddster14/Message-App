import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.MODE === 'production' ? 'https://message-app-gvu9.onrender.com' : 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
})