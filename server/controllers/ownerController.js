import User from "../models/User.js"
import fs from "fs"
import imagekit from "../config/imagekit.js"
import { format } from "path";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

// Change role to owner
const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, {
            role: "owner"
        })

        console.log("SUCCESS: User role changed to owner");
        return res.json({
            success: true,
            message: "User role changed to owner",
        });
    } catch (error) {
        console.log("ERROR  : error in changeRoleToOwner", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

// Add Car
const addCar = async (req, res) => {
    try {
        const { _id } = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        const fileBuffer = fs.readFileSync(imageFile.path);

        // upload image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/cars",
        });

        // Create optmized image url
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: 1280 }, // Width resizing
                { quality: "auto" }, // Auto quality
                { format: "webp" } // Convert to WebP format
            ]
        });

        const image = optimizedImageUrl;

        await Car.create({
            ...car,
            owner: _id,
            image
        });

        return res.json({
            success: true,
            message: "Car added successfully",
        });

    } catch (error) {
        console.log("ERROR  : error in addCar", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

// Get Owner Cars
const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id });

        return res.json({
            success: true,
            message: "Owner cars fetched successfully",
            cars
        });
    } catch (error) {
        console.log("ERROR  : error in getOwnerCars", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

// Toggle car availability
const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        if (!car) {
            return res.json({
                success: false,
                message: "Car not found",
            });
        }

        if (car.owner.toString() !== _id.toString()) {
            return res.json({
                success: false,
                message: "Unauthorized",
            });
        }

        car.isAvailable = !car.isAvailable;
        await car.save();

        return res.json({
            success: true,
            message: "Car availability toggled successfully",
        });

    } catch (error) {
        console.log("ERROR  : error in toggleCarAvailability", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

// Delete Car
const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        if (!car) {
            return res.json({
                success: false,
                message: "Car not found",
            });
        }

        if (car.owner.toString() !== _id.toString()) {
            return res.json({
                success: false,
                message: "Unauthorized",
            });
        }

        car.owner = null;
        car.isAvailable = false;
        await car.save();

        return res.json({
            success: true,
            message: "Car deleted successfully",
        });

    } catch (error) {
        console.log("ERROR  : error in deleteCar", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (role !== "owner") {
            return res.json({
                success: false,
                message: "Unauthorized",
            });
        }

        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate("car").sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({ owner: _id, status: "pending" });
        const completedBookings = await Booking.find({ owner: _id, status: "confirmed" });

        const monthlyRevenue = bookings.slice().filter(booking => booking.status === "confirmed").reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue,
        };

        return res.json({
            success: true,
            message: "Dashboard data fetched successfully",
            dashboardData
        })

    } catch (error) {
        console.log("ERROR  : error in getDashboardData", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;

        const imageFile = req.file;
        const fileBuffer = fs.readFileSync(imageFile.path);

        // upload image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/users",
        });

        // Create optmized image url
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: 400 }, // Width resizing
                { quality: "auto" }, // Auto quality
                { format: "webp" } // Convert to WebP format
            ]
        });

        const image = optimizedImageUrl;

        await User.findByIdAndUpdate(_id, { image });
        return res.json({
            success: true,
            message: "User image updated successfully",
        });

    } catch (error) {
        console.log("ERROR  : error in updateUserImage", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

export { changeRoleToOwner, addCar, getOwnerCars, toggleCarAvailability, deleteCar, getDashboardData, updateUserImage };