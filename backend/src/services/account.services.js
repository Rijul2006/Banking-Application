import accountModel from './../models/account.models';

export const createAccountServices = async (accountOwnerId) => {
    const account = await accountModel.create({accountOwner:accountOwnerId});

    return account;
}

export const getAllAccountsServices = async (accountOwnerId) => {
    const accounts = await accountModel.find({
        accountOwner: accountOwnerId
    });

    return accounts;
};