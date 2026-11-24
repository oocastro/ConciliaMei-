import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Layers3,
  Menu,
  X,
  Sun,
  Moon,
  UserRound,
} from "lucide-react";

const links = [
  { label: "Início", href: "/dashboard" },
  { label: "Conciliação", href: "/conciliacao" },
  { label: "Pagamentos", href: "/pagamentos" },
  { label: "Extratos", href: "/extratos" },
];

function getUserData() {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const storedName = localStorage.getItem("name");
    const name =
      storedUser?.name ||
      (storedName && storedName !== "undefined" ? storedName : "");

    const email = storedUser?.email || "";

    return { name, email };
  } catch {
    return {
      name: "",
      email: "",
    };
  }
}

function getInitials(name, email) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  }

  if (email && email.includes("@")) {
    const username = email.split("@")[0];
    const parts = username.split(/[._-]+/).filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return username.slice(0, 2).toUpperCase();
  }

  return "U";
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const { pathname } = useLocation();

  const { name, email } = getUserData();
  const initials = getInitials(name, email);
  const profileLabel = name || email || "Meu perfil";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
            aria-label="ConciliaMEI - início"
          >
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
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" &&
                  pathname.startsWith(`${link.href}/`));

              return (
                <Link
                  key={link.href}
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

            {/* Tema */}
            <button
              type="button"
              onClick={() => setDark((value) => !value)}
              aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
              className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Perfil */}
            <Link
              to="/settings"
              title={profileLabel}
              aria-label={`Abrir perfil de ${profileLabel}`}
              className={`flex size-10 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-sm font-semibold text-secondary-foreground transition hover:ring-2 hover:ring-primary/30 ${
                pathname === "/settings" ? "ring-2 ring-primary/50" : ""
              }`}
            >
              {initials || <UserRound size={19} />}
            </Link>

            {/* Menu mobile */}
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
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" &&
                    pathname.startsWith(`${link.href}/`));

                return (
                  <Link
                    key={link.href}
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
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="mt-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <UserRound size={18} />
                Meu perfil e configurações
              </Link>
            </div>
          </div>
        )}
      </header>

      <Outlet />
    </>
  );
}
