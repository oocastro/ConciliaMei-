
import { Router } from "express";
import pool from "../config/database.js";

const router = Router();

router.get("/", (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "ConciliaMEI API is running!",
        timestamp: new Date().toISOString(),
    });
});

router.get("/database", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS connected");

        return res.status(200).json({
            status: "success",
            message: "Database connection successful!",
            result: rows[0],
        });
    } catch (error) {
        console.error("Database connection error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Database connection failed.",
        });
    }
});

export default router;
