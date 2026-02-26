import { useState } from "react";

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
      {!open && <path d="M4 20 20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );
}

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
};

export default function PasswordField({
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  className,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        className={className ?? "h-11 w-full rounded-xl px-4 pr-12 ring-1 ring-slate-200 bg-white"}
        placeholder={placeholder}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}
        disabled={disabled}
      >
        <EyeIcon open={show} />
      </button>
    </div>
  );
}