import { useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LGPDNoticeBody, LGPDNoticeHeader } from "@/components/LGPDNotice";
import { LGPD_DIALOG_CLASS, getLGPDAcceptedAt } from "@/lib/lgpd";

function acceptedLabel(iso) {
    if (!iso) return "Aviso ainda não confirmado neste navegador.";
    const date = parseISO(iso);
    if (Number.isNaN(date.getTime())) return "Aviso confirmado neste navegador.";
    return `Aviso confirmado em ${format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}.`;
}

export default function LGPDTermsButton() {
    const ref = useRef(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const dialog = ref.current;
        if (open && dialog && !dialog.open) dialog.showModal();
    }, [open]);

    return (
        <>
            <div className="flex justify-center pb-2 pt-2">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                    Ler termos aceitos
                </button>
            </div>

            {open && (
                <dialog
                    ref={ref}
                    onClose={() => setOpen(false)}
                    onClick={(e) => e.target === ref.current && ref.current.close()}
                    aria-labelledby="lgpd-title"
                    aria-describedby="lgpd-intro"
                    className={LGPD_DIALOG_CLASS}
                >
                    <LGPDNoticeHeader>
                        <button
                            type="button"
                            onClick={() => ref.current.close()}
                            aria-label="Fechar"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border hover:bg-muted"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </LGPDNoticeHeader>

                    <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                        <LGPDNoticeBody />
                    </div>

                    <footer className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted-foreground">{acceptedLabel(getLGPDAcceptedAt())}</p>
                        <Button type="button" variant="outline" onClick={() => ref.current.close()} className="w-full sm:w-auto">
                            Fechar
                        </Button>
                    </footer>
                </dialog>
            )}
        </>
    );
}