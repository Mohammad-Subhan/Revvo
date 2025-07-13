import bcrypt from "bcrypt"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import Car from "../models/Car.js"

// Generate JWT token
const generateToken = (userId) => {
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Fill all the fields",
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        const token = generateToken(user._id.toString());

        console.log("SUCCESS: User registered successfully");
        return res.json({
            success: true,
            message: "User registered successfully",
            token
        })
    } catch (error) {
        console.log("ERROR  : error in registerUser", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid credentials",
            })
        }

        const token = generateToken(user._id.toString());
        console.log("SUCCESS: User logged in successfully");
        return res.json({
            success: true,
            message: "User logged in successfully",
            token,
        });

    } catch (error) {
        console.log("ERROR  : error in loginUser", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

// Get User Data
const getUserData = async (req, res) => {
    try {
        const { user } = req;
        console.log("SUCCESS: User data retrieved successfully");
        return res.json({
            success: true,
            message: "User data retrieved successfully",
            user,
        })
    } catch (error) {
        console.log("ERROR  : error in getUserData", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

const getCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvailable: true });
        return res.json({
            success: true,
            message: "Cars retrieved successfully",
            cars,
        });
    } catch (error) {
        console.log("ERROR  : error in getCars", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

export { registerUser, loginUser, getUserData, getCars };