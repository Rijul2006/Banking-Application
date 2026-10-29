import express from "express";
import { createAccountController, getAllAccountsController, viewAccountDetailsController } from "../controllers/account.controllers";
import { authMiddleware } from "./../middlewares/auth.middlewares";
import { accountMiddleware } from "../middlewares/account.middlewares";

const accountRoute = express.Router();

//To create an account
accountRoute.post('/create', authMiddleware, createAccountController);
//To fetch all accounts of the user
accountRoute.get('/view/allAccounts', authMiddleware, getAllAccountsController);
//To view a particular account
accountRoute.get('/view/:accountId', authMiddleware, accountMiddleware, viewAccountDetailsController)


export default accountRoute;