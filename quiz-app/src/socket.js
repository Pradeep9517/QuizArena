import { io } from "socket.io-client";

const socket = io("https://quizarena-8un2.onrender.com"); // Make sure port matches backend
export default socket;
