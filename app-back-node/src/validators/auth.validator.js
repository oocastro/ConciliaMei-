import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(2, "Nome muito curto").max(255),
    email: z.string().trim().email("E-mail inválido").max(255),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres").max(72),
});

export const loginSchema = z.object({
    email: z.string().trim().email("E-mail inválido").max(255),
    password: z.string().min(1, "Informe sua senha"),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Informe sua senha atual"),
    newPassword: z.string()
        .min(8, "A nova senha deve ter pelo menos 8 caracteres")
        .max(72, "A nova senha é muito longa"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email("E-mail inválido").max(255),
});

export const resetPasswordSchema = z.object({
    token: z.string().trim().regex(/^[a-f0-9]{64}$/i, "Link inválido ou expirado."),
    password: z.string()
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .max(72, "A senha é muito longa"),
});
