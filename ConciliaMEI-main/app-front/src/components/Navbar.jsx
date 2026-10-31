
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Layers3,
  Menu,
  X,
  Sun,
  Moon,
  ArrowUpRight,
} from "lucide-react";

const links = [
  { label: "Início", href: "/dashboard" },
  { label: "Notas", href: "/notas" },
  { label: "Conciliação", href: "/conciliacao" },
  { label: "Pagamentos", href: "/pagamentos" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Layers3 size={22} />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground">
                ConciliaMEI
              </span>
              <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground">
                PLATAFORMA DIGITAL
              </span>
            </div>
          </Link>

          {/* Links desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDark((value) => !value)}
              aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
              className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <Link
              to="/auth/register"
              className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:flex"
            >
              Começar
              <ArrowUpRight size={16} />
            </Link>

            {/* Botão mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              className="flex size-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-accent md:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="border-t border-border bg-background px-4 py-3 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <Link
                to="/auth/signin"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
              >
                Começar
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Aqui aparece a página selecionada no App.jsx */}
      <Outlet />
    </>
  );
}
