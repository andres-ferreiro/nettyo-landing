#!/usr/bin/env python3
"""Generate favicon/touch-icon assets from the real Nettyo mark.

The source (public/media/Nettyo-Solutions.png) has no transparent margin —
the shape touches close to every edge, fine for contexts where it's already
being scaled/masked (header icon, artwork panels) but cramped at favicon
sizes. This pads it onto a square canvas with a consistent margin before
resizing down, which the source alone doesn't give you for free.

Run from the repo root: python3 scripts/icons.py
"""

from PIL import Image

SRC = "public/media/Nettyo-Solutions.png"
MARGIN = 0.14  # fraction of the square canvas left empty on each side


def padded_square(size: int, background=None) -> Image.Image:
    mark = Image.open(SRC).convert("RGBA")
    inner = round(size * (1 - 2 * MARGIN))
    mark = mark.resize((inner, inner), Image.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = (size - inner) // 2
    canvas.paste(mark, (offset, offset), mark)

    if background is None:
        return canvas
    # Composited onto an opaque background — iOS renders apple-touch-icon
    # without transparency support well (shows as black otherwise).
    flat = Image.new("RGBA", (size, size), background)
    flat.alpha_composite(canvas)
    return flat.convert("RGB")


def main():
    # app/icon.png — Next.js file-convention favicon (any modern browser).
    padded_square(512).save("app/icon.png")

    # app/apple-icon.png — iOS home-screen icon, opaque background required.
    # (241, 240, 237) = --background from app/globals.css.
    padded_square(180, background=(241, 240, 237, 255)).save("app/apple-icon.png")

    # app/favicon.ico — legacy multi-resolution icon, still requested by
    # some browsers/crawlers directly regardless of the icon.png convention.
    icon_256 = padded_square(256)
    icon_256.save(
        "app/favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )

    print("wrote app/icon.png, app/apple-icon.png, app/favicon.ico")


if __name__ == "__main__":
    main()
