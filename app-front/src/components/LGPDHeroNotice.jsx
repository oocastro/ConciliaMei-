
import { useState } from "react";
import { ShieldCheck, ChevronDown, CheckCircle2 } from "lucide-react";
import { LGPDNoticeBody } from "./LGPDNotice";
import { acceptLGPD, hasAcceptedLGPD } from "../lib/lgpd";

export default function LGPDHeroNotice() {
    const [visible, setVisible] = useState(() => !hasAcceptedLGPD());
    const [checked, setChecked] = useState(false);

    function handleAccept() {
        if (!checked) return;

        acceptLGPD();
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div className="cm-lgpd-card">
            <div className="cm-lgpd-card-heading">
                <div className="cm-lgpd-card-icon">
                    <ShieldCheck size={19} />
                </div>

                <div>
                    <strong>Sua privacidade importa</strong>
                    <p>
                        Conheça como o ConciliaMEI protege seus dados.
                    </p>
                </div>
            </div>

            <details className="cm-lgpd-details">
                <summary>
                    Ler aviso de privacidade
                    <ChevronDown size={15} />
                </summary>

                <div className="cm-lgpd-full-notice">
                    <LGPDNoticeBody />
                </div>
            </details>

            <div className="cm-lgpd-card-footer">
                <label>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                    />
                    <span>Li e estou ciente do aviso de privacidade.</span>
                </label>

                <button
                    type="button"
                    disabled={!checked}
                    onClick={handleAccept}
                >
                    <CheckCircle2 size={15} />
                    Li e estou ciente
                </button>
            </div>
        </div>
    );
}
