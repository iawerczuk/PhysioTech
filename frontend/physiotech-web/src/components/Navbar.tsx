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
  const activeSection = useActiveSection(
    NAV_ITEMS.map((x) => x.id),
    140
  );

  const itemBase =
    "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200";

  const itemActive = "bg-[#102363] text-white ring-1 ring-[#102363]";
  const itemIdle =
    "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-[#102363] hover:text-white hover:ring-[#102363]";

  function handleGoTo(id: string) {
    onSelect("none"); // zamykamy panel Konto, gdy ktoś idzie do sekcji

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = `#${id}`;
    }
  }

  return (
    <nav className="hidden md:flex items-center gap-2">
      {NAV_ITEMS.map((it) => {
        const isActive = activeSection === it.id && active === "none";

        return (
          <button
            key={it.id}
            type="button"
            onClick={() => handleGoTo(it.id)}
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
  );
}