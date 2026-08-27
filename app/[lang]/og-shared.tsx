import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Dictionary } from "./dictionaries";

// Doesn't match Next's opengraph-image/twitter-image file-convention name,
// so it's never picked up as a route itself — just shared JSX for the two
// files that are (og-image size/copy needs to match between both).
export const ogSize = { width: 1200, height: 630 };

export async function ogElement(dict: Dictionary) {
  // app/icon.png (the padded, already-optimized favicon), not the raw
  // source mark — that file is ~300KB, this is ~40KB, and both render at
  // the same 72px on the output image.
  const logoData = await readFile(join(process.cwd(), "app/icon.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0f2b28",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- next/og's
          ImageResponse renders its own image pipeline (satori), not the
          browser DOM, so next/image doesn't apply here. */}
      <img src={logoSrc} width={72} height={72} alt="" />
      <div
        style={{
          marginTop: 40,
          fontSize: 54,
          fontWeight: 600,
          color: "#f1f0ed",
          maxWidth: 940,
          lineHeight: 1.15,
        }}
      >
        {dict.metadata.title}
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 28,
          color: "#9fd8d0",
          maxWidth: 860,
          lineHeight: 1.4,
        }}
      >
        {dict.metadata.description}
      </div>
    </div>
  );
}
