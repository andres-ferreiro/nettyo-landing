// Native radio input, visually hidden, driving a styled label via
// peer-checked — keeps the whole form FormData-driven with zero extra client
// state for the single-selects. Square (rounded-none), matching Industries.tsx's
// tag treatment rather than the rounded pills of the reference this was
// adapted from.
export default function PillOption({
  name,
  value,
  label,
  defaultChecked,
}: {
  name: string;
  value: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="block border border-border px-3.5 py-2 font-mono text-[11px] tracking-wide text-foreground-secondary uppercase transition-colors peer-checked:border-accent-strong peer-checked:bg-accent-soft peer-checked:text-accent-strong peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-strong">
        {label}
      </span>
    </label>
  );
}
