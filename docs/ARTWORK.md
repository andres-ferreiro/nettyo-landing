# Artwork

All page artwork comes from one generator, so seven different panels still read
as one system. Colour is the only thing that varies between them.

## The generator

`scripts/artwork.py` (Pillow, no numpy). Run from the repo root:

```bash
python3 scripts/artwork.py            # every slot
python3 scripts/artwork.py cta        # one slot
```

Output lands in `public/media/<slot>.avif`. Slots and their ramps are defined in
the `SLOTS` table at the top of the script; adding a section means adding a row
there, not writing new image code.

| Slot | Ratio | Colour | Cell | Glyphs | Field |
|---|---|---|---|---|---|
| `solution` | 4:5 | mint to deep teal | 11 | classic | 0.50 |
| `cta` | 2.4:1 | brand teal (accent ramp), masked by the Nettyo mark | 13 | soft | 0.55 |
| `product-compass` | 16:9 | crimson | 12 | classic | 0.50 |
| `product-mandhy` | 16:9 | slate to near-black | 9 | tech | 0.34 |
| `product-reviw` | 16:9 | mint to deep green | 15 | soft | 0.62 |
| `product-sanvia` | 16:9 | violet | 11 | lines | 0.44 |
| `product-clubiit` | 16:9 | magenta | 17 | round | 0.56 |
| `footer` | 4:1 | flat neutral, masked by "NETTYO SOLUTIONS" text | 13 | soft | 0.55 |

**A different seed is not enough to make panels look different.** The seed
varies the cloud structure underneath, but if every slot shares one cell size,
one glyph ramp and one diagonal, they still read as the same texture
recoloured. Three knobs carry the real difference:

- **`cell`** sets lattice density, and it is the most visible of the three.
  9px reads as a fine technical weave, 17px as a chunky halftone.
- **`chars`** picks a ramp from `RAMPS`, and each has its own character:
  `classic` is neutral, `tech` is dense and digital, `lines` is a vertical
  stroke texture, `round` is a bubble halftone, `soft` is sparse dashes.
- **`field`** is how organic vs gradient-driven the pattern is. Low values
  track the gradient and band smoothly; high values cloud up.

Font size follows `cell + 2`, so the glyphs always fill their cell.

Every ramp starts at `PAPER` (`#F1F0ED`, which must stay equal to
`--background`) and lands on a saturated corner. Nothing is a flat colour fill,
which is how the page gets colour without breaking the accent lock in
`DESIGN_GUIDELINES.md`.

## Mask: shape-driven mesh instead of noise-driven

A slot can carry `"mask": "<file in public/media>"` plus `"mask_scale"`
(size relative to `min(W, H)`) and `"mask_anchor"` (`"center"`, the
default, or `"bottom"`). When present, the ASCII mesh only draws where the
mask image's own alpha channel is present — the gradient still fills the
whole canvas, but the *texture* becomes that shape instead of a noise
cloud. Built for `cta`, which masks by the real Nettyo mark
(`Nettyo-Solutions.png`) rather than rendering a generic cloud: the ASCII
texture is recognizably the logo, not randomness.

`mask_scale` can exceed `1.0` on purpose — combined with `mask_anchor:
"bottom"`, a scale like `1.7` overflows the canvas and crops the mark
against the bottom edge, so it reads as peeking up into frame rather than
sitting whole and centered. Alpha near a cropped edge is not distorted by
this — PIL's `paste` clips out-of-bounds regions for free.

**Cap the ramp's saturated end for any mask-bearing, text-overlapping
slot.** `cta` originally reached `accent-strong` (`#0F766E`) at `t=1`,
which measured only 3.3:1 against foreground text — under the 4.5:1 AA
minimum. Stopping the ramp at `accent` (`#2DD4BF`) instead keeps the whole
brand ramp intact while guaranteeing every sampled point clears AA
(verified empirically at 5.8:1 worst-case across the text-safe zone, not
eyeballed).

### Text masks and `ink`

`"mask_text": "SOME STRING"` (with an internal `\n` for multiple stacked
lines) draws the string in a heavy system face
(`Arial Black.ttf` — a silhouette source, not a rendered site font) instead
of loading an image, then reuses the same alpha-sampling path as an image
mask. It needs different scaling logic: an image mask sizes off
`min(W, H)` (right for a roughly-square mark), but a wordmark's natural
shape is wide, so text masks size off canvas *width* instead
(`mask_scale` there means "fraction of `W`", not "fraction of
`min(W, H)`").

A **single wide line has a very flat aspect ratio** — width-filling it and
then cropping to a "bottom peek" leaves almost no height, which produced
an illegible sliver on the first attempt at `footer`. Stacking the text
onto multiple lines (`"NETTYO\nSOLUTIONS"`) is what makes a peeking crop
read as "big" rather than "a thin band." `mask_peek` (fraction of the
mask's height, from the top, that stays in frame before the rest crops
away below; default `0.5`) needs to be tuned past the halfway point for a
multi-line mask, or the crop line lands exactly on the gap between lines
and the second line never appears at all — `footer` uses `0.72`.

**`ink`** (default `1.0`) scales the glyph overlay's alpha. It exists
because chasing AA contrast for `footer` by shrinking `ink` toward zero
(down to `0.03`) never actually cleared 4.5:1 against
`--foreground-secondary` — even the bare ramp's darkest stop, with *no*
glyph ink at all, measured only 4.13:1 on its own. **`ink` is not a
contrast fix for artwork that real text sits on top of** — dial the ramp
itself lighter for that, or keep readable text off the artwork entirely
(what `Footer.tsx` does: real links sit in a solid `--background` zone,
and the mask lives in a separate text-free strip below it, where full
`ink` is safe because nothing readable ever overlaps it).

## Four things the generator does that are not obvious

1. **One draw call per mesh cell.** Drawing a whole row as a single string
   advances at the font's own 0.6em width and leaves the right third of the
   frame bare, with a hard vertical seam where it stops.
2. **The mix is rescaled across its own extent.** The raw blend of gradient
   depth and noise field clusters mid-range, so the ASCII ramp only ever
   reaches `.` and `-` and the result reads as a dot grid. Rescaling to the
   observed min/max is what makes the full `. : - = + * # % @` ramp appear.
3. **A low-frequency noise field is mixed into the character choice.** Without
   it the mesh tracks the gradient exactly and reads as flat scanlines rather
   than organic texture.
4. **Gamma above 1 holds the pale end.** Keeps most of each panel light so the
   saturated corner stays an accent rather than a fill.

## Quality

Panels encode at **AVIF q48**. Grain and an ASCII mesh are high-entropy, so
quality here is almost pure file size: at 1:1 in the densest region q80, q55 and
q45 are indistinguishable, and the panels display at roughly a third of native
size. q80 cost 4x the bytes for no visible gain (the seven slots totalled 2.6MB;
at q48 they total 1.1MB).

If you raise the resolution of a slot, re-check the total. Artwork is the
easiest way to lose the LCP budget on this page.

## Rules for every raster asset on the site

These came out of preparing the custom icons and apply to anything bitmap:

1. **Normalize scale across a set.** Crop every member of a set to the *same*
   box size, centered on its own ink bounding box. Cropping each to its own
   bounds destroys relative scale and stroke weight, and a row of icons ends up
   with a different line thickness in every cell.
2. **Flatten the background to exactly `--background`.** Generated sources carry
   grain and their base colours drift by a few levels. Side by side on the page,
   that reads as faint boxes.
3. **Lossless for flat line art.** Lossy WebP re-adds noise across the flat
   field, recreating the faint-box effect, and here it was also *10x larger*
   because the grain is what costs the bytes. Gradient panels are the opposite
   case and stay lossy AVIF.
4. **Decorative means `alt=""`.** The adjacent label carries the meaning.

## Asset locations

| Path | Contents |
|---|---|
| `public/media/*.avif` | generated gradient panels (this doc) |
| `public/media/custom-icons/` | **source** illustrations, never referenced from a component |
| `public/media/icons/` | prepared illustrations the page actually uses |
| `public/media/products/` | product screenshots and wordmarks (user-supplied) |
| `public/media/integrations/` | vendored tool logos for the hub-and-spoke diagram |
| `public/media/clients/` | client logos for the marquee |
