export const LGPD_STORAGE_KEY = "conciliaMEI_lgpd_confirmed_v1";

// <dialog> nativo, preto e branco, igual ao pop-up de pagamento
export const LGPD_DIALOG_CLASS =
    "m-auto max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-lg flex-col overflow-hidden rounded-2xl border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/60 open:flex";

// Devolve a data/hora ISO da confirmação, ou null se ainda não confirmou
export function getLGPDAcceptedAt() {
    try {
        return localStorage.getItem(LGPD_STORAGE_KEY);
    } catch {
        return null;
    }
}

export function hasAcceptedLGPD() {
    return Boolean(getLGPDAcceptedAt());
}

export function acceptLGPD() {
    const at = new Date().toISOString();
    try {
        localStorage.setItem(LGPD_STORAGE_KEY, at);
    } catch {
        /* sem storage: vale só nesta sessão */
    }
    return at;
}