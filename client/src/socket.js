import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.MODE === 'production' ? 'https://message-app-gvu9.onrender.com' : 'http://localhost:3000';

let authToken;

export const setSocketAuthToken = (token) => {

  authToken = token
}
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: (cb) => [
    cb({ token: authToken })
  ]
})