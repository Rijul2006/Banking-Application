import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token || (req.headers["authorization"]?.startsWith("Bearer ")? req.headers["authorization"].split(" ")[1]: null);

    if (!token) {
        return res.status(401).json({
            message: "Authentication token is required."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.id = decoded.userId;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};
