const API_URL = "http://localhost:8080/api/empresas";

// Lançado quando o token falta ou expirou. O backend responde 403 sem corpo nesses casos.
export class SessionExpiredError extends Error {
    constructor() {
        super("Sua sessão expirou. Faça login novamente.");
        this.name = "SessionExpiredError";
    }
}

function getToken() {
    return localStorage.getItem("token");
}

async function request(path, options = {}) {
    let response;

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${getToken()}`,
            },
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
    }

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        throw new SessionExpiredError();
    }

    return response;
}

async function parseResponse(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.erro || "Ocorreu um erro inesperado. Tente novamente.");
    }

    return data;
}

// Passo 1 do cadastro: valida e consulta o CNPJ (não salva nada).
export async function consultCnpj(cnpj) {
    const response = await request(`/consulta-cnpj/${cnpj}`);
    return parseResponse(response);
}

// Passo 2 do cadastro: o backend consulta o CNPJ de novo e salva a empresa do usuário logado.
export async function registerCompany(cnpj) {
    const response = await request("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj }),
    });
    return parseResponse(response);
}

// Retorna null se o usuário ainda não tiver empresa cadastrada.
export async function getMyCompany() {
    const response = await request("/minha-empresa");

    if (response.status === 404) return null;
    return parseResponse(response);
}
