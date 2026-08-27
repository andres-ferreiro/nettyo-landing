#!/usr/bin/env python3
"""Generate the site's grainy-gradient + ASCII artwork panels.

This is the only place page artwork comes from, so every panel shares one
texture language: a gradient travelling from the warm paper ground into a
saturated corner, heavy film grain, and an ASCII dither mesh laid over it.

Requires Pillow (no numpy). Run from the repo root:

    python3 scripts/artwork.py            # regenerate every slot
    python3 scripts/artwork.py cta        # regenerate one slot

See docs/ARTWORK.md for the rules behind the numbers.
"""

import sys
from collections import Counter
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT_DIR = "public/media"
MONO = "/System/Library/Fonts/Menlo.ttc"

PAPER = (241, 240, 237)   # must equal --background in app/globals.css

# Each ramp starts at PAPER and lands on a saturated corner. Colour is the only
# thing that varies between slots: texture, grain and mesh are shared, which is
# what makes seven different panels still read as one system.
# Per-slot mesh signatures. A different seed alone was not enough: it varies
# the cloud structure underneath, but every panel still shared one cell size,
# one glyph ramp and one diagonal, so they read as the same texture recoloured.
# `cell` sets lattice density, `chars` sets the texture's character, and
# `field` is how organic vs gradient-driven the pattern is.
RAMPS = {
    "classic": " .:-=+*#%@",
    "tech": " .:+=xX#@",
    "lines": " .,;:!|I#",
    "round": " .oO0@",
    "soft": " .-=+#",
}

SLOTS = {
    "solution": {
        "seed": 23, "cell": 11, "chars": "classic", "field": 0.50,
        "size": (1600, 2000),
        "ramp": [(0.00, PAPER), (0.34, (231, 235, 231)), (0.58, (203, 230, 222)),
                 (0.80, (138, 214, 199)), (1.00, (28, 118, 108))],
    },
    "cta": {
        # Wide full-bleed backdrop behind Final CTA's centered text, not the
        # 4:5 side panel this slot was originally sized for (that layout was
        # dropped — see docs/superpowers/specs/2026-08-27-final-cta-design.md).
        # `mask` swaps the mesh from noise-driven to logo-shaped: the ASCII
        # glyphs only draw where the mark's own alpha is present, so the
        # gradient shows everywhere but the ASCII texture *is* the logo,
        # not a random cloud.
        # mask_scale > 1 deliberately overflows the canvas: anchored to the
        # bottom, this crops the mark so it "peeks" up from the bottom edge
        # rather than sitting whole and centered.
        "seed": 91, "cell": 13, "chars": "soft", "field": 0.55,
        "size": (2400, 1000),
        "mask": "Nettyo-Solutions.png", "mask_scale": 1.7, "mask_anchor": "bottom",
        # Brand teal ramp (accent-soft -> accent-light -> accent from
        # app/globals.css), not an invented palette — matches the mark's own
        # colour instead of the generator's default warm-sand stops. Stops at
        # `accent` rather than the darker `accent-strong`: that stop measured
        # only 3.3:1 against foreground text at the panel's saturated corner,
        # under the 4.5:1 AA minimum: full brand ramp, but capped at the
        # darkest stop this text-bearing panel can safely use.
        "ramp": [(0.00, PAPER), (0.34, (230, 250, 247)), (0.62, (94, 234, 212)),
                 (1.00, (45, 212, 191))],
    },
    # Product panels. These represent other brands, so unlike the Nettyo slots
    # above they land on the product's own logo colour rather than on teal.
    # Compass and Clubiit are both red in their source logos, so their ramps
    # are pushed apart (crimson vs magenta) to stop the two tiles reading as
    # the same brand.
    # Why Nettyo panels. Nettyo's own values, so these stay in the brand ramp
    # and end in teal. They are five teals side by side, so the mesh signature
    # does the differentiating: cell size and glyph ramp vary widely.
    "why-understand": {"seed": 401, "cell": 10, "chars": "tech", "field": 0.40,
        "size": (1200, 900),
        "ramp": [(0.00, PAPER), (0.34, (228, 234, 233)), (0.58, (186, 220, 216)),
                 (0.80, (108, 190, 186)), (1.00, (18, 92, 92))]},
    "why-adapts": {"seed": 402, "cell": 16, "chars": "round", "field": 0.58,
        "size": (1200, 900),
        "ramp": [(0.00, PAPER), (0.34, (231, 236, 230)), (0.58, (198, 228, 206)),
                 (0.80, (132, 206, 164)), (1.00, (26, 104, 78))]},
    "why-ux": {"seed": 403, "cell": 12, "chars": "lines", "field": 0.46,
        "size": (1200, 900),
        "ramp": [(0.00, PAPER), (0.34, (230, 233, 238)), (0.58, (196, 214, 228)),
                 (0.80, (120, 176, 198)), (1.00, (22, 86, 104))]},
    "why-architecture": {"seed": 404, "cell": 8, "chars": "classic", "field": 0.32,
        "size": (1200, 900),
        "ramp": [(0.00, PAPER), (0.34, (232, 232, 230)), (0.58, (204, 210, 208)),
                 (0.80, (136, 160, 160)), (1.00, (30, 70, 74))]},
    "why-products": {"seed": 405, "cell": 14, "chars": "soft", "field": 0.60,
        "size": (1200, 900),
        "ramp": [(0.00, PAPER), (0.34, (229, 236, 234)), (0.58, (190, 226, 219)),
                 (0.80, (118, 206, 196)), (1.00, (16, 110, 104))]},
    "product-compass": {"seed": 7, "cell": 12, "chars": "classic", "field": 0.50,
        "size": (1600, 900),
        "ramp": [(0.00, PAPER), (0.34, (243, 233, 229)), (0.58, (238, 205, 199)),
                 (0.80, (226, 96, 92)), (1.00, (156, 26, 34))]},
    "product-mandhy": {"seed": 44, "cell": 9, "chars": "tech", "field": 0.34,
        "size": (1600, 900),
        "ramp": [(0.00, PAPER), (0.34, (232, 233, 236)), (0.58, (206, 212, 222)),
                 (0.80, (134, 150, 176)), (1.00, (38, 44, 52))]},
    "product-reviw": {"seed": 152, "cell": 15, "chars": "soft", "field": 0.62,
        "size": (1600, 900),
        "ramp": [(0.00, PAPER), (0.34, (231, 238, 234)), (0.58, (198, 230, 216)),
                 (0.80, (138, 216, 182)), (1.00, (34, 112, 86))]},
    "product-sanvia": {"seed": 268, "cell": 11, "chars": "lines", "field": 0.44,
        "size": (1600, 900),
        "ramp": [(0.00, PAPER), (0.34, (233, 230, 241)), (0.58, (211, 202, 238)),
                 (0.80, (154, 112, 244)), (1.00, (66, 32, 134))]},
    "product-clubiit": {"seed": 331, "cell": 17, "chars": "round", "field": 0.56,
        "size": (1600, 900),
        "ramp": [(0.00, PAPER), (0.34, (244, 231, 235)), (0.58, (240, 204, 216)),
                 (0.80, (246, 96, 122)), (1.00, (168, 28, 92))]},
    "footer": {
        # Bookends `cta` rather than repeating it: same peeking-mask
        # language, but masks rendered text instead of the logo image, and
        # `transparent: True` instead of a colour ramp — just the glyph ink
        # on alpha, no painted panel at all. Real link text sits in a
        # separate solid `--background` zone above this (see Footer.tsx),
        # so this strip is exempt from text-contrast rules entirely
        # (decorative, `alt=""`) — that's what makes a visible `ink` safe
        # here after chasing it toward zero failed on the earlier
        # painted-panel version.
        "seed": 91, "cell": 13, "chars": "soft", "field": 0.55,
        "size": (2400, 600), "transparent": True,
        "mask_text": "NETTYO\nSOLUTIONS", "mask_scale": 0.85,
        # 0.72 is the *maximum* reveal, reached only once a visitor scrolls
        # to the true end of the page (Footer.tsx animates a translateY on
        # this image via scroll progress) — baked into the source once,
        # rather than generating two variants, since the reveal is a CSS
        # transform on top of this fixed image.
        "mask_anchor": "bottom", "mask_peek": 0.72,
        "ink": 0.55,
        "ramp": [(0.00, PAPER), (1.00, (215, 211, 202))],
    },
    "not-found": {
        # Subtle centered watermark behind the 404 page's text — unlike
        # cta/footer, real headline/body text sits directly on top of this
        # (centered page, no separate text-free zone to isolate it in), so
        # ink stays low from the start rather than being dialed back after
        # a failed contrast check like footer's first attempt.
        "seed": 404, "cell": 12, "chars": "classic", "field": 0.42,
        "size": (1400, 1400), "transparent": True,
        "mask": "Nettyo-Solutions.png", "mask_scale": 0.95, "mask_anchor": "center",
        "ink": 0.08,
        "ramp": [(0.00, PAPER), (1.00, (215, 211, 202))],
    },
    "contacto-panel": {
        # /contacto's left-panel placeholder until a real photo replaces it
        # (single <Image src> swap — see app/[lang]/contacto/page.tsx).
        # Deliberately breaks the "every ramp starts at PAPER" rule every
        # other slot follows: those are bleed panels meant to emerge from the
        # page background at one edge, but this is a hard-edged, fully
        # self-contained rectangle with no bleed edge — nothing here touches
        # --background directly, so there's no blend to protect. It needs to
        # read as uniformly dark throughout (not light-to-dark), both for
        # reversed light-on-dark headline text and to reliably trigger
        # HeaderShell's [data-dark] inversion the moment it scrolls under the
        # fixed header, which a pale corner would undermine.
        "seed": 217, "cell": 11, "chars": "classic", "field": 0.46,
        "size": (1400, 1800),
        "mask": "Nettyo-Solutions.png", "mask_scale": 1.1, "mask_anchor": "center",
        "ramp": [(0.00, (24, 72, 66)), (0.5, (14, 48, 44)), (1.00, (8, 26, 24))],
        # Every other slot's ink is fixed near-black, which is invisible
        # against a dark ground like this one — only worked on cta/footer
        # because those sit on light ramps. `ink_color` overrides it to a
        # light mint so the masked logo actually reads on a dark panel.
        "ink_color": (120, 230, 214),
        "ink": 0.6,
    },
}

GRAIN = 0.075      # blend weight of the noise layer
GAMMA = 1.35       # >1 holds the pale end longer. Lower values spread the
                   # transition over more distance, which reads as softer.


def sample(ramp, t):
    for (t0, c0), (t1, c1) in zip(ramp, ramp[1:]):
        if t0 <= t <= t1:
            f = (t - t0) / (t1 - t0)
            return tuple(round(c0[i] + (c1[i] - c0[i]) * f) for i in range(3))
    return ramp[-1][1]


def render(name, spec):
    W, H = spec["size"]
    ramp = spec["ramp"]
    CELL = spec["cell"]
    RAMP = RAMPS[spec["chars"]]
    FIELD = spec["field"]
    CW, CH = W // CELL, H // CELL

    grad = []
    for r in range(CH):
        for c in range(CW):
            t = (0.42 * (c / (CW - 1)) + 0.58 * (r / (CH - 1))) ** GAMMA
            grad.append(sample(ramp, min(max(t, 0.0), 1.0)))

    small = Image.new("RGB", (CW, CH))
    small.putdata(grad)
    big = Image.blend(small.resize((W, H), Image.BICUBIC),
                      Image.effect_noise((W, H), 26).convert("RGB"), GRAIN)

    # Low-frequency field: without it the mesh follows the gradient exactly and
    # reads as flat scanlines instead of organic texture.
    import random
    # Per-slot seed: with one shared seed every panel grew the same cloud
    # structure and the set read as one image recoloured.
    rnd = random.Random(spec.get("seed", 23))
    coarse = Image.new("L", (24, max(2, int(24 * H / W))))
    coarse.putdata([rnd.randint(0, 255) for _ in range(coarse.width * coarse.height)])
    field = coarse.resize((CW, CH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.1))
    fpx = list(field.get_flattened_data())

    lum = [0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2] for p in grad]
    lo, hi = min(lum), max(lum)
    raw = [(1 - FIELD) * (1 - (lum[i] - lo) / (hi - lo)) + FIELD * (fpx[i] / 255)
           for i in range(CW * CH)]
    rlo, rhi = min(raw), max(raw)
    # Rescaling across the mix's own extent is what makes the full ramp appear;
    # the raw values cluster mid-range and only ever reach ". -".
    vals = [((v - rlo) / (rhi - rlo)) ** 0.85 for v in raw]

    # A mask swaps the mesh from noise-driven to shape-driven: glyphs only
    # draw where the mask's own alpha is present, scaled by that alpha so
    # the mark's antialiased edge stays soft instead of a hard cutout.
    # Sampled once per cell (at its center), not once per pixel — the mesh
    # is already cell-quantized, so a finer sample would be wasted work.
    mask_alpha = None
    if "mask" in spec or "mask_text" in spec:
        if "mask_text" in spec:
            # Same downstream path as an image mask: only the alpha channel
            # is ever read, so a rendered glyph mask and a loaded PNG mask
            # are interchangeable past this point. Arial Black purely for a
            # strong, clean silhouette — unrelated to the site's own faces.
            # multiline_* (not the single-line text/textbbox) even for a
            # one-line string: a single wide line (e.g. "NETTYO SOLUTIONS"
            # on one line) has such a wide aspect ratio that width-fill
            # scaling leaves almost no height once "bottom" anchoring halves
            # it again — the first attempt at this produced an illegible
            # sliver. Stacking onto multiple lines (pass "\n" in mask_text)
            # is what makes the mask tall enough to read as "big" once
            # cropped to its peeking half.
            bigfont = ImageFont.truetype(
                "/System/Library/Fonts/Supplemental/Arial Black.ttf", 400
            )
            probe = ImageDraw.Draw(Image.new("L", (1, 1)))
            bbox = probe.multiline_textbbox(
                (0, 0), spec["mask_text"], font=bigfont, align="center", spacing=20
            )
            tw, th = int(bbox[2] - bbox[0]), int(bbox[3] - bbox[1])
            text_l = Image.new("L", (tw, th), 0)
            ImageDraw.Draw(text_l).multiline_text(
                (-bbox[0], -bbox[1]), spec["mask_text"], font=bigfont, fill=255,
                align="center", spacing=20,
            )
            mark = Image.merge("RGBA", (text_l, text_l, text_l, text_l))
        else:
            mark = Image.open(f"{OUT_DIR}/{spec['mask']}").convert("RGBA")
        if "mask_text" in spec:
            # A wordmark's natural shape is wide, not square: sizing off
            # `min(W, H)` (right for a roughly-square logo mark) starved the
            # first attempt at this down to a few illegible pixels once
            # "bottom" anchoring halved it again. Fill canvas width instead.
            target = int(W * spec.get("mask_scale", 0.9))
            ratio = target / mark.width
        else:
            target = int(min(W, H) * spec.get("mask_scale", 0.85))
            ratio = target / max(mark.size)
        mark = mark.resize(
            (max(1, round(mark.width * ratio)), max(1, round(mark.height * ratio))),
            Image.LANCZOS,
        )
        canvas_a = Image.new("L", (W, H), 0)
        mx = (W - mark.width) // 2
        # "bottom": position the mark so only `mask_peek` of its height (from
        # the top) stays in frame, the rest crops away below — PIL's paste
        # clips out-of-bounds regions for free. Default 0.5 splits it evenly;
        # a two-line mask_text wants more, or the crop line lands exactly on
        # the gap between lines and the second line never appears at all.
        peek = spec.get("mask_peek", 0.5)
        my = H - int(mark.height * peek) if spec.get("mask_anchor") == "bottom" else (H - mark.height) // 2
        canvas_a.paste(mark.getchannel("A"), (mx, my))
        mask_px = list(canvas_a.get_flattened_data())
        mask_alpha = [
            mask_px[min(H - 1, r * CELL + CELL // 2) * W + min(W - 1, c * CELL + CELL // 2)]
            for r in range(CH) for c in range(CW)
        ]

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    font = ImageFont.truetype(MONO, CELL + 2)
    for r in range(CH):
        for c in range(CW):
            i = r * CW + c
            if mask_alpha is not None and mask_alpha[i] == 0:
                continue
            ch = RAMP[max(0, min(len(RAMP) - 1, round(vals[i] * (len(RAMP) - 1))))]
            if ch == " ":
                continue
            a = (70 + 75 * vals[i]) * spec.get("ink", 1.0)
            if mask_alpha is not None:
                a *= mask_alpha[i] / 255
            # One draw call per cell. A whole row drawn as one string advances
            # at the font's own 0.6em width and leaves the right third bare.
            d.text((c * CELL, r * CELL - CELL // 4), ch, font=font,
                   fill=(*spec.get("ink_color", (18, 24, 26)), int(a)))

    path = f"{OUT_DIR}/{name}.avif"
    if spec.get("transparent"):
        # No gradient/grain layer composited underneath — just the glyph ink
        # on true alpha, so the page's own --background shows through
        # everywhere except the letterforms themselves. `ramp` above is
        # still used (to vary glyph density across the shape via `vals`),
        # it just never becomes a visible painted layer.
        overlay.save(path, quality=80)
        modal = "transparent"
    else:
        out = Image.alpha_composite(big.convert("RGBA"), overlay).convert("RGB")
        # q48: at 1:1 in the densest mesh region q80/q55/q45 are
        # indistinguishable, and these panels display at roughly a third of
        # native size. q80 cost 4x the bytes for nothing. Grain and mesh are
        # high-entropy, so quality here is almost pure file size.
        out.save(path, quality=48)
        modal = Counter(out.get_flattened_data()).most_common(1)[0][0]
    print(f"{path:<44} {W}x{H}  modal {modal}")


if __name__ == "__main__":
    wanted = sys.argv[1:] or list(SLOTS)
    for n in wanted:
        if n not in SLOTS:
            sys.exit(f"unknown slot {n!r}; known: {', '.join(SLOTS)}")
        render(n, SLOTS[n])
