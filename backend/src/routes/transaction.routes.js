import express from 'express';
import {authMiddleware} from './../middlewares/auth.middlewares';
import {accountMiddleware} from './../middlewares/account.middlewares';
import { depositController, withdrawalController, transferController, viewRecentTransactionController } from '../controllers/transaction.controllers';

const transactionRoute = express.Router();

//deposit
transactionRoute.post('/deposit/:accountId', authMiddleware, accountMiddleware, depositController);

//withdrawal
transactionRoute.post('/withdrawal/:accountId', authMiddleware, accountMiddleware, withdrawalController);

//transfer
transactionRoute.post('/transfer/:accountId', authMiddleware, accountMiddleware, transferController);

//view transaction history

//view recent transaction
transactionRoute.get('/view/recent/:accountId', authMiddleware, accountMiddleware, viewRecentTransactionController)

//view particular transaction
transactionRoute.get('/view/:accountId/:transactionId', authMiddleware, accountMiddleware, viewTransactionController);

export default transactionRoute;