import mongoose from "mongoose"

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        mongoose.connection.on("connected", () => console.log("SUCCESS: Database connected successfully!"));
        await mongoose.connect(`${process.env.MONGODB_URI}/revvo`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
    } catch (error) {
        console.error("ERROR: Error connecting to MongoDB:", error.message);
    }
}

export default connectDB;