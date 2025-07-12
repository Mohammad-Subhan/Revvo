import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protect = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        console.log("ERROR  : User not authenticated");
        return res.json({
            success: false,
            message: "User not authenticated",
        })
    }

    try {
        const userId = jwt.decode(token, process.env.JWT_SECRET);
        if (!userId) {
            console.log("ERROR  : User not authenticated");
            return res.json({
                success: false,
                message: "User not authenticated",
            })
        }

        req.user = await User.findById(userId).select("-password");
        next();
    } catch (error) {
        console.log("ERROR  : User not authenticated");
        return res.json({
            success: false,
            message: "User not authenticated",
        })
    }
}

export { protect };