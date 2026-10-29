import accountModel from './../models/account.models';

export const createAccountServices = async (accountOwnerId) => {
    const account = await accountModel.create({accountOwner:accountOwnerId});

    return account;
}