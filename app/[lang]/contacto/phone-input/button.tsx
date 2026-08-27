import * as React from "react";
import { cn } from "./utils";

type ButtonVariant = "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50";

// No rounded-* — radius is 0 everywhere on this site, hard lock.
const variants: Record<ButtonVariant, string> = {
  outline: "border border-border bg-surface text-foreground hover:border-foreground",
  ghost: "text-foreground-secondary hover:text-foreground",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(base, variants[variant], className)} {...props} />
  ),
);
Button.displayName = "Button";
