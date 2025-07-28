import MessageRepo from "./features/messages/message.repository.js";

const messageRepo = new MessageRepo();
const users = {};

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("setUsername", (username) => {
      socket.username = username;
      users[socket.id] = username;

      socket.broadcast.emit("notification", `${username} joined the Chat`);
      io.emit("userCount", Object.keys(users).length);
    });

    socket.on("disconnect", () => {
      const username = socket.username;
      delete users[socket.id];

      if (username) {
        socket.broadcast.emit("notification", `${username} left the chat`);
      }

      // Send updated user count
      io.emit("userCount", Object.keys(users).length);
    });

    //Send Previous Messages

    socket.on("getMessages", async () => {
      const messages = await messageRepo.getAllMessages();
      socket.emit("previousMessages", messages);
    });

    //Save and emit the new message:-

    socket.on("chatMessage", async (msg) => {
      console.log("Message recieved:", msg);

      const msgData = {
        sender: msg.user,
        content: msg.text,
        profilePic: msg.profilePic,
      };

      const savedMsg = await messageRepo.createMessage(msgData);
      io.emit("chatMessage", {
        ...msg,
        _id: savedMsg._id,
        timestamp: savedMsg.timestamp,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("typing", (user) => {
      console.log(`${user} is typing`);
      socket.broadcast.emit("userTyping", user);
    });

    socket.on("stopTyping", (user) => {
      socket.broadcast.emit("userStopTyping", user);
    });
  });
};
