import Navbar from "./Navbar";
import ptLogo from "../assets/pt.png";

type Props = {
  activePanel: "none" | "konto";
  onSelectPanel: (v: "none" | "konto") => void;
};

export default function Header({ activePanel, onSelectPanel }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur ring-1 ring-slate-200/60">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="relative flex items-center">
          <img
            src={ptLogo}
            alt="PhysioTech"
            className="
              absolute left-0 top-1/2 -translate-y-1/2
              h-50 w-auto object-contain
              pointer-events-none select-none
            "
          />
          <span className="w-40" />
        </a>

        <div className="flex items-center gap-3">
          <Navbar active={activePanel} onSelect={onSelectPanel} />

          <a
            href="#kontakt"
            className="
              rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white
              transition hover:bg-emerald-700
              focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2
            "
          >
            Kontakt
          </a>
        </div>
      </div>
    </header>
  );
}