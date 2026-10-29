import accountModel from "./../models/account.models.js";

export const accountMiddleware = async (req, res, next) => {
    try {
        const accountId = req.params.accountId;

        const account = await accountModel.findOne({
            _id: accountId,
            accountOwner: req.id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found or access denied."
            });
        }

        req.account = account;

        next();
    } catch (err) {
        next(err);
    }
};
