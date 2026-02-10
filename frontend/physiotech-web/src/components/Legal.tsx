type Props = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Legal({ open, title, children, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* overlay */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Zamknij"
      />

      {/* modal */}
      <div className="relative mx-auto mt-16 w-[min(900px,92vw)]">
        <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-lg overflow-hidden">
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200/70">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Wersja robocza do projektu
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Zamknij
            </button>
          </div>

          <div className="max-h-[70vh] overflow-auto px-6 py-5 text-sm text-slate-700 leading-relaxed">
            {children}
          </div>

          <div className="px-6 py-4 border-t border-slate-200/70 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-full bg-[#102363] px-6 text-sm font-medium text-white hover:opacity-95"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}