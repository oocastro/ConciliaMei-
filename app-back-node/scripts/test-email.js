import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

try {
    await transporter.verify();
    console.log("SMTP autenticado com sucesso!");
} catch (error) {
    console.error("Falha na autenticação SMTP:", error.message);
    process.exitCode = 1;
}
