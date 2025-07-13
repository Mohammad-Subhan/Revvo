import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "../config/database.js"
import userRouter from "../routes/userRoutes.js"
import ownerRouter from "../routes/ownerRoutes.js"
import bookingRouter from "../routes/bookingRoutes.js"
import serverless from "serverless-http"

// PORT configuration
// const PORT = process.env.PORT || 3000;

// Initialize the express app
const app = express();

// Connect to the database
const connect = async () => {
    try {
        await connectDB();
    } catch (err) {
        console.error("Database connection failed:", err);
    }
};
await connect();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Server is running!"));
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

// app.listen(PORT, () => console.log(`SUCCESS: Server is running on port ${PORT}`));
export const handler = serverless(app);