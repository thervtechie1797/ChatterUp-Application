import express from "express";
import MessageController from "./message.controller.js";

const messageCont = new MessageController();

const messageRouter = express.Router();

messageRouter.post("/", (req, res) => {
  messageCont.createMessage(req, res);
});

messageRouter.get("/", (req, res) => {
  messageCont.getMessages(req, res);
});

export default messageRouter;
