import UserModel from "../../schemas/user.schema.js";
import bcrypt from "bcrypt";

export default class UserRepo {
  createUser = async (data) => {
    return await UserModel.create(data);
  };

  findUserByUsername = async (username) => {
    return await UserModel.findOne({ username });
  };

  findUserByCredentials = async (username, password) => {
    const user = await UserModel.findOne({ username });
    if (!user) return null;

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) return null;

    return user; //authentication successful
  };
}
