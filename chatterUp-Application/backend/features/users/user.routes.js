import express from "express";
import UserController from "./user.controller.js";

const userController = new UserController();

const useRouter = express.Router();

useRouter.post("/register", (req, res) => {
  userController.registerUser(req, res);
});

useRouter.post("/login", (req, res) => {
  userController.loginUser(req, res);
});

export default useRouter;
