import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

const allowedOrigins = (
    process.env.FRONTEND_URL || "http://localhost:5173"
).split(",").map(origin => origin.trim());

app.use(helmet());

app.use(cors({
    origin: allowedOrigins,
}));

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

export default app;
