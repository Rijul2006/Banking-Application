import express from 'express';
import {authMiddleware} from './../middlewares/auth.middlewares';
import {accountMiddleware} from './../middlewares/account.middlewares'

const transactionRoute = express.Router();

//deposit
transactionRoute.post('/deposit', authMiddleware, accountMiddleware, depositController);

//withdrawal

//transfer

//view transaction history

//view recent transaction

//view particular transaction

export default transactionRoute;