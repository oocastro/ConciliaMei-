
import { Router } from "express";

import {
    register,
    login,
    me,
    changePassword,
    forgotPassword,
    resetPassword,
    deleteAccount,
} from "../controllers/auth.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { passwordRecoveryLimiter } from "../middlewares/rate-limit.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticateToken, me);
router.put("/change-password", authenticateToken, changePassword);
router.delete("/delete-account", authenticateToken, deleteAccount);

router.post("/forgot-password", passwordRecoveryLimiter, forgotPassword);
router.post("/reset-password", passwordRecoveryLimiter, resetPassword);

export default router;
