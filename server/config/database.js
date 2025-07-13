import mongoose from "mongoose"

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("SUCCESS: Database connected successfully!"));
        await mongoose.connect(`${process.env.MONGODB_URI}/revvo`);
    } catch (error) {
        console.error("ERROR: Error connecting to MongoDB:", error.message);
    }
}

export default connectDB;