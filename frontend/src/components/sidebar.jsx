import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    RefreshCcw,
    ClipboardCheck,
    Settings,
    ChevronLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ITEMS = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Notas Fiscais", to: "/notas", icon: FileText },
    { label: "Conciliação", to: "/conciliacao", icon: RefreshCcw },
    { label: "Comprovantes", to: "/comprovantes", icon: ClipboardCheck },
    { label: "Configurações", to: "/configuracoes", icon: Settings },
];

const STORAGE_KEY = "conciliamei:sidebar-collapsed";

/**
 * @param {{ user?: { name?: string, cnpj?: string } }} props
 * Abaixo de 768px (md) a barra fica sempre recolhida, só com CSS.
 */
export function Sidebar({ user }) {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) === "1";
        } catch {
            return false;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
        } catch {
            /* ignora */
        }
    }, [collapsed]);

    const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?";

    return (
        <aside
            className={cn(
                "sticky top-4 flex h-[calc(100dvh-2rem)] shrink-0 flex-col overflow-hidden rounded-2xl bg-foreground p-3 text-background transition-[width] duration-200 motion-reduce:transition-none max-md:w-19",
                collapsed ? "w-19" : "w-64",
            )}
        >
            <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
                aria-expanded={!collapsed}
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border border-background/40 hover:bg-background/10 max-md:hidden",
                    collapsed ? "self-center" : "self-end",
                )}
            >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </button>

            <div className="px-1 pb-6 pt-3 text-center">
                <div
                    aria-hidden="true"
                    className={cn(
                        "mx-auto flex items-center justify-center rounded-full border-background/40 bg-background font-extrabold text-foreground transition-all max-md:h-11 max-md:w-11 max-md:border-2 max-md:text-base",
                        collapsed ? "h-11 w-11 border-2 text-base" : "h-20 w-20 border-4 text-3xl",
                    )}
                >
                    {initial}
                </div>
                <div className={cn("max-md:hidden", collapsed && "hidden")}>
                    <p className="mt-3 wrap-break-word text-lg font-extrabold">{user?.name ?? "Seu nome"}</p>
                    <p className="mt-1 text-xs tabular-nums text-background/60">
                        {user?.cnpj ? `CNPJ ${user.cnpj}` : "CNPJ não informado"}
                    </p>
                </div>
            </div>

            <nav aria-label="Principal" className="flex flex-col gap-1">
                {ITEMS.map(({ label, to, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        title={label}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-semibold max-md:justify-center max-md:px-0",
                                collapsed && "justify-center px-0",
                                isActive
                                    ? "bg-background text-foreground"
                                    : "text-background/60 hover:text-background",
                            )
                        }
                    >
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        <span className={cn("max-md:hidden", collapsed && "hidden")}>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}