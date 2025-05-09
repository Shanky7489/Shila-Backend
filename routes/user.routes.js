import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";
import auth from "../middlewares/auth.js";

const UserRouter = express.Router();
// user routes
UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/logout", logoutUser);
UserRouter.get("/userprofile", auth, getUserProfile);

export default UserRouter;
