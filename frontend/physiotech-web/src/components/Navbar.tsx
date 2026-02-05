import { useState } from "react";

type NavItem = { id: string; label: string };

const NAV: NavItem[] = [
  { id: "o-nas", label: "O nas" },
  { id: "jak-to-dziala", label: "Jak to działa" },
  { id: "sprzet", label: "Sprzęt" },
  { id: "faq", label: "FAQ" },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState<string>(NAV[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const currentId = hoveredId ?? activeId;

  function goTo(id: string) {
    setActiveId(id);

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = `#${id}`;
    }
  }

  return (
    <nav className="hidden md:flex items-center gap-2 text-sm">
      {NAV.map((item) => {
        const isActive = currentId === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(item.id)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(item.id)}
            onBlur={() => setHoveredId(null)}
            className={[
              "rounded-full px-4 py-2 font-medium transition-colors",
              "ring-1 ring-transparent",
              isActive
                ? "bg-[#102363] text-white ring-[#102363]"
                : "bg-transparent text-slate-700 hover:bg-[#102363] hover:text-white hover:ring-[#102363]",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}