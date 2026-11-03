import { depositServices, withdrawalServices } from "../services/transaction.services.js";

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
    
}
