import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            status: "error",
            message: "Token de autenticação não informado.",
        });
    }

    const token = authorization.split(" ")[1];

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET não configurado.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.sub;

        return next();
    } catch {
        return res.status(401).json({
            status: "error",
            message: "Token inválido ou expirado.",
        });
    }
}
