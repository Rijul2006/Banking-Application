import transactionModel from './../models/transaction.models.js';
import { depositServices } from './../services/transaction.services.js';

export const depositController = async (req, res, next) => {
    try {
        const { toAccount, type, amount, idempotencyKey } = req.body;

        if (!toAccount || !type || amount === undefined || !idempotencyKey) {
            return res.status(400).json({
                message: "To Account, type, amount and idempotencyKey are required for deposit."
            });
        }

        if (toAccount.toString() !== req.account._id.toString()) {
            return res.status(400).json({
                message: "Invalid To Account."
            });
        }

        if (req.account.status !== "Active") {
            return res.status(400).json({
                message: "Amount can't be deposited in an inactive account."
            });
        }

        if (type !== "DEPOSIT") {
            return res.status(400).json({
                message: "Invalid transaction type."
            });
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Please enter a valid amount."
            });
        }

        const isIdempotencyExists = await transactionModel.findOne({
            idempotencyKey
        });

        if (isIdempotencyExists) {
            return res.status(409).json({
                message: "Idempotency key already exists."
            });
        }

        const deposit = await depositServices(
            toAccount,
            type,
            amount,
            idempotencyKey, 
            req.account
        );

        return res.status(201).json({
            message: "Amount deposited successfully.",
            transaction: deposit
        });

    } catch (err) {
        next(err);
    }
};