import Image from "next/image";
import Grid from "../Grid";
import { getDictionary } from "../../[lang]/dictionaries";

const clients = [
  { file: "BrewBrothers_WebAssets-02-scaled.png", name: "Brew Brothers", ratio: 2560 / 1190 },
  { file: "artistica.png", name: "Artística", ratio: 1811 / 566 },
  {
    file: "bajaferretera.png",
    name: "Baja Ferretera",
    ratio: 420 / 108,
    // solid-background badge, not a transparent mark: the brightness-0
    // silhouette trick used for the rest turns this into a black block
    opaqueBg: true,
  },
  { file: "casarosa.png", name: "Casa Rosa", ratio: 1046 / 285 },
  { file: "chazzo.png", name: "Chazzo", ratio: 1536 / 569 },
  { file: "interstellar.png", name: "Interstellar Club", ratio: 586 / 316, scale: 1.4 },
  { file: "kinei.png", name: "Kinei", ratio: 2000 / 625 },
  { file: "la-marquesa.png", name: "La Marquesa", ratio: 360 / 127 },
  { file: "patitadeperro.png", name: "Patita de Perro", ratio: 1069 / 318 },
  { file: "pork-horizontal.png", name: "POR-K", ratio: 1643 / 398 },
  { file: "suculenta.png", name: "Suculenta", ratio: 1046 / 285 },
  { file: "vibrant-logo.png", name: "Vibrant Smile Dental", ratio: 1000 / 266 },
];

const LOGO_HEIGHT = 32;

function LogoRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={ariaHidden}
    >
      {clients.map(({ file, name, ratio, opaqueBg, scale = 1 }) => (
        <div
          key={file}
          className="relative shrink-0"
          style={{
            height: LOGO_HEIGHT * scale,
            width: LOGO_HEIGHT * ratio * scale,
          }}
        >
          <Image
            src={`/media/clients/${file}`}
            alt={ariaHidden ? "" : name}
            fill
            sizes="150px"
            className={
              opaqueBg
                ? "object-contain grayscale opacity-80 transition duration-300 sm:opacity-60 hover:opacity-100 hover:grayscale-0"
                : "object-contain brightness-0 opacity-70 transition duration-300 sm:opacity-45 hover:opacity-100 hover:brightness-100"
            }
          />
        </div>
      ))}
    </div>
  );
}

export default async function ClientsMarquee() {
  const t = (await getDictionary()).clientsMarquee;

  return (
    <section className="border-b border-border bg-surface py-12">
      <Grid className="items-center">
        <span className="col-span-2 font-mono text-xs tracking-wider text-foreground-secondary uppercase sm:col-span-4 lg:col-span-2 lg:col-start-1">
          {t.label}
        </span>

        <div
          className="relative col-span-2 overflow-hidden sm:col-span-4 lg:col-span-4 lg:col-start-3"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex w-fit origin-left scale-[0.92] animate-[marquee-scroll_65s_linear_infinite] motion-reduce:animate-none sm:scale-100 sm:animate-[marquee-scroll_50s_linear_infinite]">
            <LogoRow />
            <LogoRow ariaHidden />
          </div>
        </div>
      </Grid>
    </section>
  );
}
