import { createAccountServices } from "../services/account.services";

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