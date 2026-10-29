import userModel from './../models/user.models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerServices = async (username, email, password) => {
    const userExists = await userModel.findOne({email});

    if(userExists){
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userModel.create({
        username, email, hashedPassword
    });

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {user, token};
};

export const loginServices = async (email, password)=> {
    const user = await userModel.findOne({email}).select('+hashedPassword');
    if(!user){
        throw new Error("Invalid email or password.");
    }
    
    const verifyPassword = await bcrypt.compare(password, user.hashedPassword);

    if(!verifyPassword){
        throw new Error("Invalid email or password.");
    }

    const token = jwt.sign(
        {userId: user._id}, 
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );

    return {user, token};    
};
