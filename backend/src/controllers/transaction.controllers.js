import accountModel from "../models/account.models.js";
import { depositServices, withdrawalServices, transferServices, viewRecentTransactionServices, viewTransactionServices } from "../services/transaction.services.js";

export const depositController = async (req, res, next) => {
    try {
        const { amount, idempotencyKey } = req.body;
        const accountId = req.account._id;

        // Validate required fields
        if (amount === undefined || !idempotencyKey) {
            return res.status(400).json({
                message: "Amount and idempotencyKey are required for deposit."
            });
        }

        // Validate account status
        if (req.account.status !== "Active") {
            return res.status(400).json({
                message: "Amount can't be deposited in an inactive account."
            });
        }

        // Validate amount
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Please enter a valid amount."
            });
        }

        // Validate idempotency key
        if (typeof idempotencyKey !== "string" || !idempotencyKey.trim()) {
            return res.status(400).json({
                message: "Please provide a valid idempotency key."
            });
        }

        const deposit = await depositServices(
            accountId,
            amount,
            idempotencyKey
        );

        return res.status(201).json({
            message: "Amount deposited successfully.",
            transaction: deposit
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Idempotency key already exists."
            });
        }

        next(err);
    }
};

export const withdrawalController = async (req, res, next) => {
    try {
        const { amount, idempotencyKey } = req.body;
        const accountId = req.account._id;

        // Validate required fields
        if (amount === undefined || !idempotencyKey) {
            return res.status(400).json({
                message: "Amount and idempotencyKey are required for withdrawal."
            });
        }

        // Validate account status
        if (req.account.status !== "Active") {
            return res.status(400).json({
                message: "Amount can't be withdrawn from an inactive account."
            });
        }

        // Validate amount
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Please enter a valid amount."
            });
        }

        // Validate idempotency key
        if (typeof idempotencyKey !== "string" || !idempotencyKey.trim()) {
            return res.status(400).json({
                message: "Please provide a valid idempotency key."
            });
        }

        const withdrawal = await withdrawalServices(
            accountId,
            amount,
            idempotencyKey
        );

        return res.status(201).json({
            message: "Amount withdrawn successfully.",
            transaction: withdrawal
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Idempotency key already exists."
            });
        }
        next(err);
    }
};

export const transferController = async (req, res, next) => {
    try{
        const {toAccountId, amount, idempotencyKey} = req.body;

        const toAccount = await accountModel.findOne({_id: toAccountId});

        if(!toAccount || amount == undefined || !idempotencyKey){
            return res.status(400).json({
                message: "Amount and idempotencyKey are required for tranfer."
            });
        }

        if (req.account._id.toString() === toAccountId) {
            return res.status(400).json({
                message: "Cannot transfer money to the same account."
            });
        }

        // Validate account status
        if (req.account.status !== "Active" || toAccount.status !== "Active") {
            return res.status(400).json({
                message: "Both from account and to account must have an active status."
            });
        }

        // Validate amount
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Please enter a valid amount."
            });
        }

        // Validate idempotency key
        if (typeof idempotencyKey !== "string" || !idempotencyKey.trim()) {
            return res.status(400).json({
                message: "Please provide a valid idempotency key."
            });
        }

        const transaction = await transferServices(
            req.account._id,
            toAccountId,
            amount,
            idempotencyKey
        );

        return res.status(201).json({
            message: "Amount transfered successfully.",
            transaction
        });
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Idempotency key already exists."
            });
        }
        next(err);
    }
}

export const viewTransactionController = async (req, res, next) => {
    try{
        const transactionId = req.params.transactionId;
        const accountId = req.account._id;
        const transaction = await viewTransactionServices(transactionId, accountId);

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found."
            });
        }

        return res.status(200).json({
            message:"Transaction fetched successfully.",
            transaction
        });

    }catch(err){
        next(err);
    }
}

export const viewRecentTransactionController = async (req, res, next) => {
    try {
        const accountId = req.account._id;

        const transactions = await viewRecentTransactionServices(accountId);

        if (transactions.length === 0) {
            return res.status(404).json({
                message: "Transactions not found."
            });
        }

        return res.status(200).json({
            message: "Recent transactions fetched successfully.",
            transactions
        });

    } catch (err) {
        next(err);
    }
};

export const viewTransactionHistoryController = async (req, res, next) => {
    try {
        const accountId = req.account._id;

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

        const result = await viewTransactionHistoryServices(
            accountId,
            page,
            limit
        );

        return res.status(200).json({
            message: "Transaction history fetched successfully.",
            ...result
        });

    } catch (err) {
        next(err);
    }
};