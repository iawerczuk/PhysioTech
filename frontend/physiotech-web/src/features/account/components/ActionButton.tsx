type Props = {
  active?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit";
};

export default function ActionButton({
  active,
  disabled,
  className,
  onClick,
  children,
  type = "button",
}: Props) {
  const base =
    "h-10 rounded-full px-4 text-sm font-medium ring-1 transition-colors duration-150 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const disabledCls = disabled ? "cursor-not-allowed opacity-60" : "";

  const variant = active
    ? [
        "bg-[#102363] text-white ring-[#102363]",
        "hover:bg-[#0c1c4f]",
        "active:bg-[#081339]",
        "focus-visible:ring-[#102363]",
      ].join(" ")
    : [
        "bg-white text-slate-700 ring-slate-200",
        "hover:bg-slate-50 hover:ring-slate-300",
        "active:bg-slate-100",
        "focus-visible:ring-slate-400",
      ].join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[base, disabledCls, variant, className ?? ""].join(" ").trim()}
    >
      {children}
    </button>
  );
}