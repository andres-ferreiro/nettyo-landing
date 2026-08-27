"use client";

import Image from "next/image";
import { Lightning, PlugsConnected, ChartLineUp } from "@phosphor-icons/react";

const icons = [Lightning, PlugsConnected, ChartLineUp];

export default function HeroBrandMark({
  capabilities,
}: {
  capabilities: readonly string[];
}) {
  return (
    <div className="hidden flex-col items-center justify-center gap-8 lg:flex">
      <div className="relative h-40 w-40">
        <span className="pointer-events-none absolute -top-3 -left-3 h-5 w-5 border-t border-l border-accent-strong" />
        <span className="pointer-events-none absolute -right-3 -bottom-3 h-5 w-5 border-r border-b border-accent-strong" />
        <Image
          src="/media/Nettyo-Solutions.png"
          alt="Nettyo Solutions"
          fill
          className="object-contain p-4"
        />
      </div>

      <div className="h-10 w-px border-l border-dashed border-accent-strong/40" />

      <div className="flex gap-4">
        {capabilities.map((label, i) => {
          const Icon = icons[i];
          return (
            <div
              key={label}
              className="flex h-12 w-12 items-center justify-center border border-border bg-background"
              title={label}
            >
              <Icon size={22} className="text-foreground-secondary" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
