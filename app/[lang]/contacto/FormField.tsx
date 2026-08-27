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
  const fieldClass =
    "w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-foreground-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong";

  return (
    <div>
      <label
        htmlFor={name}
        className="font-mono text-xs tracking-wide text-foreground-secondary uppercase"
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
