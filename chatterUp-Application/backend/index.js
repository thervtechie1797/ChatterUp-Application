import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import useRouter from "./features/users/user.routes.js";
import messageRouter from "./features/messages/message.routes.js";
import { socketHandler } from "./socketHandler.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/users", useRouter);
app.use("/api/messages", messageRouter);

//serve frontend directly
const publicPath = path.join(__dirname, "../frontend/public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: publicPath });
});

app.get("/", (req, res) => {
  res.sendFile("chat.html", { root: publicPath });
});

const PORT = process.env.PORT || 3500;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
