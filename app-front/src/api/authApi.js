const API_BASE = (
    import.meta.env.VITE_API_URL || "http://localhost:3001/api"
).replace(/\/+$/, "");

const API_URL = `${API_BASE}/auth`;

async function tratarResposta(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message || "Não foi possível realizar a operação."
        );
    }

    return data;
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    return tratarResposta(response);
}

export async function register(name, email, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });

    return tratarResposta(response);
}

export async function getCurrentUser(token) {
    const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return tratarResposta(response);
}

export async function changePassword(currentPassword, newPassword) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Sua sessão expirou. Entre novamente.");
    }

    const response = await fetch(`${API_URL}/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            currentPassword,
            newPassword,
        }),
    });

    return tratarResposta(response);
}

export async function forgotPassword(email) {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    return tratarResposta(response);
}

export async function resetPassword(token, password) {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
    });

    return tratarResposta(response);
}

export async function deleteAccount(currentPassword) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Sua sessão expirou. Entre novamente.");
    }

    const response = await fetch(`${API_URL}/delete-account`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword }),
    });

    return tratarResposta(response);
}
