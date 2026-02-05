
import type { ReactNode } from "react";

type Props = {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
};

export default function Pill({ active, children, onClick, href, className }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition select-none";
  const state = active
    ? "bg-blue-navy text-white"
    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-blue-navy hover:text-white hover:ring-blue-navy";

  const cls = [base, state, className].filter(Boolean).join(" ");

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}