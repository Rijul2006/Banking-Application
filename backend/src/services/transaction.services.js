import transactionModel from './../models/transaction.models.js';

export const depositServices = async (
    toAccountId,
    type,
    amount,
    idempotencyKey,
    toAccount
) => {
    const deposit = await transactionModel.create({
        toAccount: toAccountId,
        type,
        amount,
        idempotencyKey
    });

    toAccount.balance += amount;

    await toAccount.save();

    return deposit;
};