import { rateLimit } from "express-rate-limit";

// Limita tentativas nas rotas de recuperação de senha (por IP).
export const passwordRecoveryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        status: "error",
        message: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    },
});
