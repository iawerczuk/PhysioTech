import Navbar from "./Navbar";
import ptLogo from "../assets/pt.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur ring-1 ring-slate-200/60">
      <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 hover:opacity-90 transition">
          <img
            src={ptLogo}
            alt="PhysioTech"
            className="h-28 w-auto object-contain"
          />
        </a>

        <div className="flex items-center gap-3">
          <Navbar />

          <a
            href="#kontakt"
            className="
              rounded-full
              bg-emerald-600
              px-5 py-2
              text-sm font-medium
              text-white
              transition
              hover:bg-emerald-700
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-600
              focus-visible:ring-offset-2
            "
          >
            Kontakt
          </a>
        </div>
      </div>
    </header>
  );
}