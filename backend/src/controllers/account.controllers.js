import { createAccountServices, getAllAccountsServices } from "../services/account.services";

export const createAccountController = async (req, res, next) => {
    const accountOwnerId = req.id;
    try{
        const account = await createAccountServices(accountOwnerId)
        return res.status(201).json({
            message:"Account created successfully.",
            account
        });
    }
    catch(err){
        next(err);
    }
};

export const getAllAccountsController = async (req, res, next) => {
    try{
        const accounts = await getAllAccountsServices(req.id);

        return res.status(200).json({
            message: "Accounts fetched successfully.",
            accounts
        });

    }catch(err){
        next(err);
    }
};

export const viewAccountDetailsController = (req, res) => {
    const account = req.account;

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    return res.status(200).json({
        message: "Account details fetched successfully.",
        account
    });
};