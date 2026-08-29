// A bordered block, not a floating card — the one sanctioned exception to
// DESIGN_SYSTEM.md's "no elevated cards" rule (border only, no shadow, no
// radius). `value` must stay a number or short alphanumeric code: Doto is a
// dot-matrix display face and full words become hard to read in it.
export default function StatCard({
  value,
  label,
  caption,
  variant = "plain",
}: {
  value: string;
  label: string;
  caption?: string;
  variant?: "plain" | "glass";
}) {
  const surface =
    variant === "glass"
      ? "bg-white/60 backdrop-blur-md"
      : "border border-border bg-surface";

  return (
    <div className={`flex h-full flex-col gap-3 p-8 lg:p-10 ${surface}`}>
      <span className="font-doto text-5xl font-thin tracking-tight text-foreground break-words lg:text-6xl">
        {value}
      </span>
      <span className="font-mono text-[15px] font-medium tracking-wide text-foreground uppercase">
        {label}
      </span>
      {caption && (
        <p className="mt-1 max-w-[26ch] text-sm leading-relaxed text-foreground-secondary">
          {caption}
        </p>
      )}
    </div>
  );
}
