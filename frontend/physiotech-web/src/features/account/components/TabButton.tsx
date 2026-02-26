type Props = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export default function TabButton({ active, onClick, children, disabled, className }: Props) {
  const cls = [
    "h-10 rounded-full px-4 text-sm font-medium ring-1 transition-colors duration-150",
    active
      ? "bg-[#102363] text-white ring-[#102363]"
      : "bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200",
    disabled ? "cursor-not-allowed opacity-60" : "",
    className ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}