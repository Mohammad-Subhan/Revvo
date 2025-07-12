import express from "express"
import { protect } from "../middleware/auth.js"
import { addCar, changeRoleToOwner, deleteCar, getOwnerCars, toggleCarAvailability, getDashboardData, updateUserImage } from "../controllers/ownerController.js"
import upload from "../middleware/multer.js"

const ownerRouter = express.Router();

ownerRouter.put("/role", protect, changeRoleToOwner);
ownerRouter.post("/cars", upload.single("image"), protect, addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.delete("/cars", protect, deleteCar);
ownerRouter.put("/cars", protect, toggleCarAvailability);
ownerRouter.get("/dashboard", protect, getDashboardData);
ownerRouter.put("/image", upload.single("image"), protect, updateUserImage);

export default ownerRouter;