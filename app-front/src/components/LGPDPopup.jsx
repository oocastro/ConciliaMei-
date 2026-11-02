import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { LGPDNoticeBody, LGPDNoticeHeader } from "@/components/LGPDNotice";
import { LGPD_DIALOG_CLASS, acceptLGPD, hasAcceptedLGPD } from "@/lib/lgpd";

/**
 * Aviso obrigatório: só aparece se o usuário ainda não confirmou (em nenhuma página).
 * Não fecha por Esc nem por clique fora. Use <LGPDPopup /> no Login e na futura hero page.
 */
export default function LGPDPopup({ onAccepted }) {
    const dialogRef = useRef(null);
    const confirmedRef = useRef(false);
    const [open, setOpen] = useState(() => !hasAcceptedLGPD());
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (open && dialog && !dialog.open) dialog.showModal();
    }, [open]);

    function handleConfirm() {
        if (!checked) return;
        confirmedRef.current = true;
        acceptLGPD();
        dialogRef.current?.close();
        setOpen(false);
        onAccepted?.();
    }

    if (!open) return null;

    return (
        <dialog
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lgpd-title"
            aria-describedby="lgpd-intro"
            onCancel={(e) => e.preventDefault()}
            onClose={() => {
                // tem alguns navegadores q fecham no segundo Esc: reabre se ainda não confirmou
                if (!confirmedRef.current) dialogRef.current?.showModal();
            }}
            className={LGPD_DIALOG_CLASS}
        >
            <LGPDNoticeHeader />

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                <LGPDNoticeBody />
            </div>

            <footer className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-foreground"
                    />
                    <span>Li e estou ciente do aviso de privacidade do ConciliaMEI.</span>
                </label>
                <Button type="button" disabled={!checked} onClick={handleConfirm} className="w-full sm:w-auto">
                    Li e estou ciente
                </Button>
            </footer>
        </dialog>
    );
}