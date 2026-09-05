import { io } from "socket.io-client";

const socket = io("https://resolvex-backend-01f9.onrender.com/api", {
  withCredentials: true,
  // autoConnect: true,
});

export default socket;
