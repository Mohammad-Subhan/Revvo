import Booking from "../models/Booking.js"
import Car from "../models/Car.js";

const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },
    });

    return bookings.length === 0;
}

// Check Available Cars
const checkAvailableCars = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        // Fetch all cars in the specified location
        const cars = await Car.find({ location, isAvailable: true });

        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
            return { ...car._doc, isAvailable: isAvailable };
        });

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true);

        return res.json({
            success: true,
            availableCars,
        });

    } catch (error) {
        console.log("ERROR  : error in checkAvailableCars", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

// Create Booking
const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({
                success: false,
                message: "Car is not available",
            });
        }

        const carData = await Car.findById(car);

        // Calculate price
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({
            car,
            owner: carData.owner,
            user: _id,
            pickupDate,
            returnDate,
            price
        });

        return res.json({
            success: true,
            message: "Booking created successfully",
        });

    } catch (error) {
        console.log("ERROR  : error in checkAvailableCars", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const booking = await Booking.find({ user: _id }).populate("car").sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: "Bookings fetched successfully",
            bookings: booking,
        });

    } catch (error) {
        console.log("ERROR  : error in getUserBookings", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.json({
                success: false,
                message: "Unauthorized",
            });
        }

        const bookings = await Booking.find({ owner: req.user._id }).populate("car user").select("-user.password").sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: "Owner bookings fetched successfully",
            bookings,
        });

    } catch (error) {
        console.log("ERROR  : error in getOwnerBookings", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId);

        if (booking.owner.toString() !== _id.toString()) {
            return res.json({
                success: false,
                message: "Unauthorized",
            });
        }

        booking.status = status;
        await booking.save();

        return res.json({
            success: true,
            message: "Booking status updated successfully",
        });

    } catch (error) {
        console.log("ERROR  : error in changeBookingStatus", error.message);
        return res.json({
            success: false,
            message: error.message,
        });
    }
}

export {
    checkAvailableCars,
    createBooking,
    getUserBookings,
    getOwnerBookings,
    changeBookingStatus
};