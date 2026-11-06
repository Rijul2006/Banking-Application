import mongoose from "mongoose";
import accountModel from "../models/account.models.js";
import transactionModel from "../models/transaction.models.js";

export const depositServices = async ( accountId, amount, idempotencyKey ) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Update account balance atomically
        const account = await accountModel.findOneAndUpdate(
            {
                _id: accountId,
                status: "Active"
            },
            {
                $inc: { balance: amount }
            },
            {
                new: true,
                session
            }
        );

        if (!account) {
            const error = new Error("Account not found or inactive.");
            error.statusCode = 404;
            throw error;
        }

        // 2. Create deposit transaction entry
        const [deposit] = await transactionModel.create(
            [{
                toAccount: accountId,
                type: "DEPOSIT",
                amount,
                idempotencyKey,
                status: "COMPLETED"
            }],
            { session }
        );

        // 3. Commit transaction
        await session.commitTransaction();

        return deposit;

    } catch (err) {
        // 4. Rollback if any operation fails
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        throw err;

    } finally {
        // 5. End session
        await session.endSession();
    }
};

export const withdrawalServices = async (accountId, amount, idempotencyKey) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Check balance and deduct amount atomically
        const account = await accountModel.findOneAndUpdate(
            {
                _id: accountId,
                status: "Active",
                balance: { $gte: amount }
            },
            {
                $inc: { balance: -amount }
            },
            {
                new: true,
                session
            }
        );

        if (!account) {
            const error = new Error(
                "Account not found, inactive, or insufficient balance."
            );
            error.statusCode = 400;
            throw error;
        }

        // 2. Create withdrawal transaction entry
        const [withdrawal] = await transactionModel.create(
            [{
                fromAccount: accountId,
                type: "WITHDRAWAL",
                amount,
                idempotencyKey,
                status: "COMPLETED"
            }],
            { session }
        );

        // 3. Commit transaction
        await session.commitTransaction();

        return withdrawal;

    } catch (err) {
        // 4. Rollback if any operation fails
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        throw err;

    } finally {
        // 5. End session
        await session.endSession();
    }
};

export const transferServices = async (fromAccountId, toAccountId, amount, idempotencyKey) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Deduct amount from source account atomically
        const fromAccount = await accountModel.findOneAndUpdate(
            {
                _id: fromAccountId,
                status: "Active",
                balance: { $gte: amount }
            },
            {
                $inc: { balance: -amount }
            },
            {
                new: true,
                session
            }
        );

        if (!fromAccount) {
            const error = new Error(
                "Source account not found, inactive, or insufficient balance."
            );
            error.statusCode = 400;
            throw error;
        }

        // 2. Credit amount to destination account atomically
        const toAccount = await accountModel.findOneAndUpdate(
            {
                _id: toAccountId,
                status: "Active"
            },
            {
                $inc: { balance: amount }
            },
            {
                new: true,
                session
            }
        );

        if (!toAccount) {
            const error = new Error(
                "Destination account not found or inactive."
            );
            error.statusCode = 400;
            throw error;
        }

        // 3. Create transfer transaction entry
        const [transfer] = await transactionModel.create(
            [{
                fromAccount: fromAccountId,
                toAccount: toAccountId,
                type: "TRANSFER",
                amount,
                idempotencyKey,
                status: "COMPLETED"
            }],
            { session }
        );

        // 4. Commit transaction
        await session.commitTransaction();

        return transfer;

    } catch (err) {
        // 5. Rollback if any operation fails
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        throw err;

    } finally {
        // 6. End session
        await session.endSession();
    }
}

export const viewTransactionServices = async (transactionId, accountId) => {
    const transaction = await transactionModel.findOne({
        _id: transactionId,
        $or:[{fromAccount: accountId}, {toAccount: accountId}]
    });

    return transaction;
}

export const viewRecentTransactionServices = async (accountId) => {
    const transactions = await transactionModel.find({
        $or: [
            { fromAccount: accountId },
            { toAccount: accountId }
        ]
    })
    .sort({ createdAt: -1 })
    .limit(10);

    return transactions;
};

export const viewTransactionHistoryServices = async (accountId, page, limit) => {

    const skip = (page - 1) * limit;

    const filter = {
        $or: [
            { fromAccount: accountId },
            { toAccount: accountId }
        ]
    };

    const [transactions, totalTransactions] = await Promise.all([
        transactionModel.find(filter)
            .sort({ createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit),

        transactionModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalTransactions / limit);

    if(page > totalPages && totalTransactions > 0){
        const error = new Error(
            `Invalid page number. Only ${totalPages} pages are available.`
        );
        error.statusCode = 400;
        throw error;
    }

    return {
        transactions,
        pagination: {
            currentPage: page,
            totalPages,
            totalTransactions,
            limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    };
};