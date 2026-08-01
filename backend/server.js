import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import processRouter from "./process.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend Running~ chillax and enjoy",
    });
});

// Routes
app.use("/api/process", processRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        error: "Internal Server Error",
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});