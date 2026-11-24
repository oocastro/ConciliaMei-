import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import pool from "../config/database.js";
import { sendPasswordResetEmail } from "./mail.service.js";

function generateToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET não configurado.");
    }

    return jwt.sign(
        { sub: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
}

function publicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}

export async function registerUser({ name, email, password }) {
    const normalizedEmail = email.toLowerCase();

    const [existingUsers] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [normalizedEmail]
    );

    if (existingUsers.length > 0) {
        const error = new Error("Este e-mail já está cadastrado.");
        error.status = 409;
        throw error;
    }

    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.execute(
        `INSERT INTO users (id, name, email, password)
         VALUES (?, ?, ?, ?)`,
        [id, name, normalizedEmail, hashedPassword]
    );

    const user = { id, name, email: normalizedEmail };

    return {
        user,
        token: generateToken(user),
    };
}

export async function loginUser({ email, password }) {
    const normalizedEmail = email.toLowerCase();

    const [users] = await pool.execute(
        "SELECT id, name, email, password FROM users WHERE email = ?",
        [normalizedEmail]
    );

    if (users.length === 0) {
        const error = new Error("E-mail ou senha incorretos.");
        error.status = 401;
        throw error;
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        const error = new Error("E-mail ou senha incorretos.");
        error.status = 401;
        throw error;
    }

    return {
        user: publicUser(user),
        token: generateToken(user),
    };
}

export async function findUserById(id) {
    const [users] = await pool.execute(
        "SELECT id, name, email FROM users WHERE id = ?",
        [id]
    );

    return users[0] || null;
}

export async function changeUserPassword(userId, { currentPassword, newPassword }) {
    const [users] = await pool.execute(
        "SELECT id, password FROM users WHERE id = ?",
        [userId]
    );

    const user = users[0];

    if (!user) {
        const error = new Error("Usuário não encontrado.");
        error.statusCode = 404;
        throw error;
    }

    const passwordMatches = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!passwordMatches) {
        const error = new Error("A senha atual está incorreta.");
        error.statusCode = 400;
        throw error;
    }

    if (currentPassword === newPassword) {
        const error = new Error("A nova senha deve ser diferente da atual.");
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await pool.execute(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId]
    );

    return true;
}

// ---------------------------------------------------------------------------
// Recuperação de senha
// ---------------------------------------------------------------------------

const RESET_TOKEN_TTL_MINUTES = 30;

let resetTableReady = false;

async function ensureResetTable() {
    if (resetTableReady) return;

    await pool.execute(
        `CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id         CHAR(36) NOT NULL PRIMARY KEY,
            user_id    CHAR(36) NOT NULL,
            token_hash CHAR(64) NOT NULL,
            expires_at DATETIME NOT NULL,
            used_at    DATETIME NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_prt_token_hash (token_hash),
            KEY idx_prt_user (user_id)
        )`
    );

    resetTableReady = true;
}

function hashResetToken(token) {
    return createHash("sha256").update(token).digest("hex");
}

function buildResetUrl(token) {
    const baseUrl = (process.env.FRONTEND_URL || "http://localhost:5173")
        .split(",")[0]
        .trim()
        .replace(/\/+$/, "");

    return `${baseUrl}/auth/reset-password?token=${token}`;
}

// Nunca revela se o e-mail existe: retorna normalmente nos dois casos.
export async function requestPasswordReset({ email }) {
    await ensureResetTable();

    const normalizedEmail = email.toLowerCase();

    const [users] = await pool.execute(
        "SELECT id, name, email FROM users WHERE email = ?",
        [normalizedEmail]
    );

    const user = users[0];

    if (!user) return;

    const token = randomBytes(32).toString("hex");

    // Invalida pedidos anteriores ainda pendentes deste usuário.
    await pool.execute(
        "DELETE FROM password_reset_tokens WHERE user_id = ? AND used_at IS NULL",
        [user.id]
    );

    await pool.execute(
        `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
         VALUES (?, ?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? MINUTE))`,
        [randomUUID(), user.id, hashResetToken(token), RESET_TOKEN_TTL_MINUTES]
    );

    await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl: buildResetUrl(token),
        expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
    });
}

export async function resetPasswordWithToken({ token, password }) {
    await ensureResetTable();

    const invalidLink = () => {
        const error = new Error("Link inválido ou expirado. Solicite um novo link de recuperação.");
        error.statusCode = 400;
        return error;
    };

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute(
            `SELECT id, user_id FROM password_reset_tokens
             WHERE token_hash = ? AND used_at IS NULL AND expires_at > UTC_TIMESTAMP()
             FOR UPDATE`,
            [hashResetToken(token)]
        );

        const record = rows[0];

        if (!record) throw invalidLink();

        const hashedPassword = await bcrypt.hash(password, 12);

        await connection.execute(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, record.user_id]
        );

        await connection.execute(
            "UPDATE password_reset_tokens SET used_at = UTC_TIMESTAMP() WHERE id = ?",
            [record.id]
        );

        // Qualquer outro link pendente do usuário deixa de valer.
        await connection.execute(
            "DELETE FROM password_reset_tokens WHERE user_id = ? AND used_at IS NULL",
            [record.user_id]
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
