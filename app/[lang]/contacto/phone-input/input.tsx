import * as React from "react";
import { cn } from "./utils";

// Matches FormField.tsx's fieldClass exactly, minus the border-left (this
// sits attached to the country-select button, see phone-input.tsx). No
// rounded-* anywhere — radius is 0 everywhere on this site, hard lock.
export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full border border-border bg-transparent px-3 py-2.5 text-base text-foreground sm:py-2 sm:text-sm placeholder:text-foreground-secondary/70 outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
