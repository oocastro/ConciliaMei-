const API_URL = "http://localhost:8080/auth";

async function tratarResposta(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.erro || "E-mail ou senha inválidos.");
    }

    return data;
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    return tratarResposta(response);
}

export async function register(name, email, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });

    return tratarResposta(response);
}