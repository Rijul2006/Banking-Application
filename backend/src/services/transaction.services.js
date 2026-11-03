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

export const withdrawalServices = async (
    accountId,
    amount,
    idempotencyKey
) => {
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
