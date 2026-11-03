import express from 'express';
import {authMiddleware} from './../middlewares/auth.middlewares';
import {accountMiddleware} from './../middlewares/account.middlewares';
import { depositController, withdrawalController } from '../controllers/transaction.controllers';

const transactionRoute = express.Router();

//deposit
transactionRoute.post('/deposit/:accountId', authMiddleware, accountMiddleware, depositController);

//withdrawal
transactionRoute.post('/withdrawal/:accountId', authMiddleware, accountMiddleware, withdrawalController);

//transfer
transactionRoute.post('/transfer/:accountId', authMiddleware, accountMiddleware, tranferController);

//view transaction history

//view recent transaction

//view particular transaction

export default transactionRoute;