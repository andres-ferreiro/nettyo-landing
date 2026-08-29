import Image from "next/image";

// The wordmark art (public/media/footer.avif) is the full, uncropped
// "NETTYO\nSOLUTIONS" mark (2400x600). Two things kept this from reading
// well: letting it bleed full-width meant the strip's own height (and the
// space it ate on the page) kept growing with the viewport forever, and the
// ink is faint by design (see scripts/artwork.py), so it needed a touch more
// contrast than the bare page background gives it.
//
// `max-w-[1600px]` caps how tall the strip can ever get, matching Grid's own
// cap so the two don't drift apart. `aspect-[2400/460]` shows ~77% of the
// image (object-top keeps NETTYO complete and cuts into SOLUTIONS rather
// than the reverse) — short of the full 600px so it still reads as bleeding
// off the bottom, not floating in its own box.
export default function FooterArt() {
  return (
    <div className="relative mx-auto aspect-[2400/460] w-full max-w-[1600px] overflow-hidden">
      <Image
        src="/media/footer.avif"
        alt=""
        fill
        sizes="(min-width: 1600px) 1600px, 100vw"
        className="object-cover object-top"
      />
    </div>
  );
}
