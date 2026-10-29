import express from "express";
import { createAccountController } from "../controllers/account.controllers";

const accountRoute = express.Router();

//To create an account
accountRoute.post('/create', authMiddleware, createAccountController);
//To view account balance

//To fetch all accounts of the user

export default accountRoute;