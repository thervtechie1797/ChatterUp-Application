import MessageRepo from "./message.repository.js";

const messageRepo = new MessageRepo();

export default class MessageController {
  createMessage = async (req, res) => {
    try {
      const { sender, content } = req.body;

      if (!sender || !content) {
        return res
          .status(400)
          .json({ message: "Sender  and content are required" });
      }

      const saved = await messageRepo.createMessage({ sender, content });
      res.status(201).json(saved);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error saving messages" });
    }
  };

  getMessages = async (req, res) => {
    try {
      const messages = await messageRepo.getAllMessages();
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ message: "Error Fetchinf message" });
    }
  };
}
