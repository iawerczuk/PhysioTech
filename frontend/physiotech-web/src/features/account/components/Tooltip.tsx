type Props = {
  text: string;
};

export default function Tooltip({ text }: Props) {
  return (
    <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden w-max max-w-[260px] rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
      {text}
    </div>
  );
}