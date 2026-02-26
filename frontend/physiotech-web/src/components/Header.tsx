import Navbar from "./Navbar";
import ptLogo from "../assets/pt.png";

type ActivePanel = "none" | "konto" | "rental";

type Props = {
  activePanel: ActivePanel;
  onSelectPanel: (v: ActivePanel) => void;
};

export default function Header({ activePanel, onSelectPanel }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur ring-1 ring-slate-200/60">
      <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center">
          <img
            src={ptLogo}
            alt="PhysioTech"
            className="h-10 w-auto object-contain"
          />
        </a>

        <div className="flex items-center gap-3">
          <Navbar
            active={activePanel}
            onSelect={(v: ActivePanel) => onSelectPanel(v)}
          />

          <a
            href="#kontakt"
            className="
              h-11 rounded-full bg-emerald-600 px-6
              text-sm font-medium text-white
              inline-flex items-center justify-center
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