import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import songRouter from "./routes/songRoute.js";
import albumRouter from "./routes/albumRoute.js";
import authRouter from "./routes/authRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: [
        process.env.ADMIN_URL || "http://localhost:5173",
        process.env.FRONTEND_URL || "http://localhost:5174"
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/song", songRouter);
app.use("/api/album", albumRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});

const startServer = async () => {
    try {
        await connectDB();
        await connectCloudinary();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
