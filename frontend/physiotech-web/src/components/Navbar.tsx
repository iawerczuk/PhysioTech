import { useEffect, useState } from "react";
import useActiveSection from "../hooks/useActiveSection";

type Props = {
  active: "none" | "konto";
  onSelect: (v: "none" | "konto") => void;
};

const NAV_ITEMS = [
  { id: "o-nas", label: "O nas" },
  { id: "jak-to-dziala", label: "Jak to działa" },
  { id: "sprzet", label: "Sprzęt" },
  { id: "faq", label: "FAQ" },
] as const;

export default function Navbar({ active, onSelect }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeSection = useActiveSection(
    NAV_ITEMS.map((x) => x.id),
    140
  );

  const itemBase =
    "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#102363]/40";
  const itemActive = "bg-[#102363] text-white ring-1 ring-[#102363]";
  const itemIdle =
    "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-[#102363] hover:text-white hover:ring-[#102363]";

  function goTo(id: string) {
    onSelect("none");
    setMobileOpen(false);

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = `#${id}`;
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    if (mobileOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      {/* DESKTOP */}
      <nav className="hidden md:flex items-center gap-2">
        {NAV_ITEMS.map((it) => {
          const isActive = activeSection === it.id && active === "none";
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => goTo(it.id)}
              className={`${itemBase} ${isActive ? itemActive : itemIdle}`}
            >
              {it.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onSelect(active === "konto" ? "none" : "konto")}
          className={`${itemBase} ${active === "konto" ? itemActive : itemIdle}`}
        >
          Konto
        </button>
      </nav>

      {/* MOBILE: hamburger */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded-full h-10 w-10 ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition"
        aria-label="Otwórz menu"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="#102363" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Zamknij menu"
            onClick={() => setMobileOpen(false)}
          />

          {/* panel */}
          <div className="absolute right-3 top-3 w-[min(92vw,360px)] rounded-2xl bg-white ring-1 ring-slate-200 shadow-lg p-3">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="text-sm font-semibold text-slate-900">Menu</div>
              <button
                type="button"
                className="rounded-full h-9 w-9 ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition inline-flex items-center justify-center"
                aria-label="Zamknij"
                onClick={() => setMobileOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-2 grid gap-2">
              {NAV_ITEMS.map((it) => {
                const isActive = activeSection === it.id && active === "none";
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => goTo(it.id)}
                    className={`w-full text-left ${itemBase} ${isActive ? itemActive : itemIdle}`}
                  >
                    {it.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  onSelect(active === "konto" ? "none" : "konto");
                  setMobileOpen(false);
                }}
                className={`w-full text-left ${itemBase} ${active === "konto" ? itemActive : itemIdle}`}
              >
                Konto
              </button>

              {/* Kontakt w drawerze jako link */}
              <a
                href="#kontakt"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white text-center hover:bg-emerald-700 transition ring-1 ring-emerald-600"
              >
                Kontakt
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}