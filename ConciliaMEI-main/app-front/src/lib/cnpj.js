// Utilitários de CNPJ usados no cadastro de empresa.
// A validação aqui serve só para dar resposta rápida ao usuário:
// o backend (CnpjValidator) continua sendo quem decide.

export function onlyDigits(value) {
    return String(value ?? "").replace(/\D/g, "");
}

// 33000167000101 -> 33.000.167/0001-01 (funciona também com o CNPJ pela metade)
export function formatCnpj(value) {
    return onlyDigits(value)
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

function checkDigit(numbers, length) {
    const weights =
        length === 12
            ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
            : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < length; i++) {
        sum += numbers[i] * weights[i];
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(value) {
    const digits = onlyDigits(value);

    if (digits.length !== 14) return false;

    // Rejeita sequências repetidas (00000000000000, 11111111111111...)
    if (/^(\d)\1{13}$/.test(digits)) return false;

    const numbers = digits.split("").map(Number);

    return (
        checkDigit(numbers, 12) === numbers[12] &&
        checkDigit(numbers, 13) === numbers[13]
    );
}
