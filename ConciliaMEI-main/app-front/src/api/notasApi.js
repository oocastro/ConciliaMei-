
const API_URL = "http://localhost:8080/api/notas";

export async function carregarNotas(cnpj) {
    try {
        const response = await fetch(
            `${API_URL}?cnpj=${encodeURIComponent(cnpj)}`,
            {
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const notas = await response.json();

        return notas;
    } catch (error) {
        console.error("Erro ao buscar notas:", error);
        throw error;
    }
}
