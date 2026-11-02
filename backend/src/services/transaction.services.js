import mongoose from "mongoose";
import transactionModel from "./../models/transaction.models.js";

export const depositServices = async (
    toAccountId,
    type,
    amount,
    idempotencyKey,
    toAccount
) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const [deposit] = await transactionModel.create(
            [{
                toAccount: toAccountId,
                type,
                amount,
                idempotencyKey
            }],
            { session }
        );

        toAccount.balance += amount;
        await toAccount.save({ session });

        deposit.status = "COMPLETED";
        await deposit.save({ session });

        await session.commitTransaction();

        return deposit;

    } catch (err) {
        await session.abortTransaction();
        throw err;

    } finally {
        await session.endSession();
    }
};