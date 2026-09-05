import { io } from "socket.io-client";

const allowedOrigins = [
  "http://localhost:5173",
  "https://resolve-x-college-issue-safety-mana.vercel.app",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

const socket = io("https://resolvex-backend-01f9.onrender.com/api", {
  withCredentials: true,
<<<<<<< HEAD
  
=======
  // autoConnect: true,
>>>>>>> 629e4f604b959dc562623128e07c01565a4faa32
});

export default socket;