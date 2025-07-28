import MessageModel from "../../schemas/message.schema.js";

export default class MessageRepo {
  createMessage = async (data) => {
    return await MessageModel.create(data);
  };

  getAllMessages = async () => {
    return await MessageModel.find().sort({ timestamp: 1 });
  };
}
