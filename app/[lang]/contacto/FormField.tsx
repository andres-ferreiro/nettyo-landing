// Shared text-input/textarea markup — used 3x as a plain input (name, email,
// company) and once as a textarea (message). Scoped to this route rather than
// app/components/: nothing else on the site has a form yet to share this with.
export default function FormField({
  as = "input",
  name,
  label,
  placeholder,
  type = "text",
  required,
  error,
}: {
  as?: "input" | "textarea";
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  // text-base below sm is not a type choice: iOS Safari zooms the viewport
  // whenever a focused input is under 16px, and never zooms back out — on
  // the first field of the site's only form. py-2.5 + 16px type also lifts
  // the control to a 44px touch target.
  const fieldClass =
    "w-full border border-border bg-transparent px-3 py-2.5 text-base text-foreground placeholder:text-foreground-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong sm:py-2 sm:text-sm";

  return (
    <div>
      <label
        htmlFor={name}
        className="font-mono text-xs tracking-wide text-foreground uppercase"
      >
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          rows={2}
          className={`mt-1.5 resize-none ${fieldClass}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`mt-1.5 ${fieldClass}`}
        />
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
