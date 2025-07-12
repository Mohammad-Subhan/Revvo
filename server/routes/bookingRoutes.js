import express from "express"
import { changeBookingStatus, checkAvailableCars, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js"
import { protect } from "../middleware/auth.js"

const bookingRouter = express.Router()

bookingRouter.post("/check-availability", checkAvailableCars);
bookingRouter.post("/", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/owner", protect, getOwnerBookings);
bookingRouter.put("/", protect, changeBookingStatus);

export default bookingRouter;