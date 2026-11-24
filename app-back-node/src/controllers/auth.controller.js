import {
    registerUser,
    loginUser,
    findUserById,
    changeUserPassword,
    requestPasswordReset,
    resetPasswordWithToken,
} from "../services/auth.service.js";

import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "../validators/auth.validator.js";

export async function register(req, res) {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            message: "Dados inválidos.",
            errors: validation.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    try {
        const result = await registerUser(validation.data);

        return res.status(201).json({
            status: "success",
            message: "Usuário cadastrado com sucesso.",
            ...result,
        });
    } catch (error) {
        console.error("Register error:", error.message);

        return res.status(error.status || 500).json({
            status: "error",
            message: error.status ? error.message : "Erro ao cadastrar usuário.",
        });
    }
}

export async function login(req, res) {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            message: "Dados inválidos.",
            errors: validation.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    try {
        const result = await loginUser(validation.data);

        return res.status(200).json({
            status: "success",
            message: "Login realizado com sucesso.",
            ...result,
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(error.status || 500).json({
            status: "error",
            message: error.status ? error.message : "Erro ao realizar login.",
        });
    }
}

export async function me(req, res) {
    try {
        const user = await findUserById(req.userId);

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Usuário não encontrado.",
            });
        }

        return res.status(200).json({
            status: "success",
            user,
        });
    } catch (error) {
        console.error("User lookup error:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Erro ao consultar usuário.",
        });
    }
}

export async function changePassword(req, res) {
    try {
        const validation = changePasswordSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: validation.error.issues[0].message,
            });
        }

        await changeUserPassword(req.userId, validation.data);

        return res.status(200).json({
            status: "success",
            message: "Senha alterada com sucesso.",
        });
    } catch (error) {
        console.error("Erro ao alterar senha:", error);

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.statusCode
                ? error.message
                : "Não foi possível alterar sua senha.",
        });
    }
}

export async function forgotPassword(req, res) {
    const validation = forgotPasswordSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            message: validation.error.issues[0].message,
        });
    }

    // Resposta neutra e imediata: não revela se o e-mail existe nem o tempo de envio.
    res.status(200).json({
        status: "success",
        message: "Se o e-mail estiver cadastrado, enviaremos um link para redefinir sua senha.",
    });

    try {
        await requestPasswordReset(validation.data);
    } catch (error) {
        console.error("Forgot password error:", error.message);
    }
}

export async function resetPassword(req, res) {
    const validation = resetPasswordSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            status: "error",
            message: validation.error.issues[0].message,
        });
    }

    try {
        await resetPasswordWithToken(validation.data);

        return res.status(200).json({
            status: "success",
            message: "Senha redefinida com sucesso.",
        });
    } catch (error) {
        console.error("Reset password error:", error.message);

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.statusCode
                ? error.message
                : "Não foi possível redefinir sua senha.",
        });
    }
}
