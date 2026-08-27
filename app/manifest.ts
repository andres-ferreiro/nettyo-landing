import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nettyo Solutions",
    short_name: "Nettyo",
    description: "Software a medida, automatización con IA y productos SaaS.",
    start_url: "/es",
    display: "standalone",
    background_color: "#f1f0ed",
    theme_color: "#0f766e",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
