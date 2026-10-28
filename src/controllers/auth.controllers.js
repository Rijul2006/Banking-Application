import {registerServices, loginServices} from './../services'

export const registerController = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {

        if(!username || !email || !password){
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        const {user, token} = await registerServices(username, email, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User registered successfully",
            username: user.username,
            email: user.email
        });

    } catch (err) {
        next(err);
    }
};

export const loginController = async (req, res, next) => {
    const { email, password } = req.body;

    try {

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const {user, token} = await loginServices( email, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "User login was successful",
            username: user.username,
            email: user.email
        });

    } catch (err) {
        next(err);
    }
};

