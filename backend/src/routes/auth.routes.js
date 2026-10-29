import express from "express";
import { registerController, loginController, logoutController } from "./../controllers/auth.controllers";

const authRoute = express.Router();

authRoute.post('/register', registerController);
authRoute.post('/login', loginController);
authRoute.post('/logout', logoutController)

export default authRoute;