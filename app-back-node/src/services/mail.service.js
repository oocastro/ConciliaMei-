import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
    if (!process.env.SMTP_HOST) return null;

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === "true",
            auth: process.env.SMTP_USER
                ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
                : undefined,
        });
    }

    return transporter;
}

export async function sendPasswordResetEmail({ to, name, resetUrl, expiresInMinutes }) {
    const mailer = getTransporter();

    // Sem SMTP configurado: em desenvolvimento, mostra o link no console.
    if (!mailer) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("SMTP_HOST não configurado.");
        }

        console.log(`[DEV] Link de recuperação de senha para ${to}: ${resetUrl}`);
        return;
    }

    const firstName = (name || "").split(" ")[0] || "";

    await mailer.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to,
        subject: "Redefinição de senha - ConciliaMEI",
        text:
            `Olá${firstName ? `, ${firstName}` : ""}!\n\n` +
            `Recebemos um pedido para redefinir a senha da sua conta no ConciliaMEI.\n` +
            `Use o link abaixo (válido por ${expiresInMinutes} minutos):\n\n${resetUrl}\n\n` +
            `Se você não fez esse pedido, ignore este e-mail. Sua senha continua a mesma.`,
        html:
            `<p>Olá${firstName ? `, ${firstName}` : ""}!</p>` +
            `<p>Recebemos um pedido para redefinir a senha da sua conta no <strong>ConciliaMEI</strong>.</p>` +
            `<p><a href="${resetUrl}">Criar nova senha</a></p>` +
            `<p>O link é válido por ${expiresInMinutes} minutos e só pode ser usado uma vez.</p>` +
            `<p>Se você não fez esse pedido, ignore este e-mail. Sua senha continua a mesma.</p>`,
    });
}
