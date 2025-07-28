import UserRepo from "./user.repository.js";

const userRepo = new UserRepo();

export default class UserController {
  registerUser = async (req, res) => {
    const { username, password, profilePic } = req.body;
    try {
      let user = await userRepo.findUserByUsername(username);
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = await userRepo.createUser({
        username,
        password,
        profilePic,
      });
      res.status(201).json(newUser);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "Registration failed", error: err.message });
    }
  };

  loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Incoming Login request:", username);

      const user = await userRepo.findUserByCredentials(username, password);
      console.log(user);

      if (!user) {
        console.log("Login failed: Invalid username or password");
        return res.status(401).json({ message: "Invalid credentials" });
      }
      console.log("Login Successful:", user.username);
      res.status(200).json({ message: "Login successful", user });
    } catch (err) {
      res.status(500).json({ message: "Login Failed!", error: err.message });
    }
  };
}
