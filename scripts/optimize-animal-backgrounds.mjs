// Reemplaza los GIFs gigantes (10-43 MB) usados como fondo por clase de
// animal en Acuario, por fotos reales optimizadas en WebP.
//
// Uso (una sola vez, ya corrido):
//   bun run scripts/optimize-animal-backgrounds.mjs

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC_DIR =
  "C:/Users/alejo/AppData/Local/Temp/claude/C--Users-alejo-dev-Proyectos-Personal-Curriculum-Web/d1e86553-70bd-430a-84a1-31d6d951490c/scratchpad/animal-bgs";
const OUT_DIR = "public/images";

const files = [
  { src: "anfibios.jpg", out: "bg-anfibios.webp" },
  { src: "mamiferos.jpg", out: "bg-mamiferos.webp" },
  { src: "aves.jpg", out: "bg-aves.webp" },
  { src: "crustaceos.jpg", out: "bg-crustaceos.webp" },
  { src: "reptiles.jpg", out: "bg-reptiles.webp" },
  { src: "peces.jpg", out: "bg-peces.webp" },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const { src, out } of files) {
    const inputPath = `${SRC_DIR}/${src}`;
    const outputPath = `${OUT_DIR}/${out}`;

    const before = await sharp(inputPath).metadata();
    await sharp(inputPath)
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(outputPath);

    const fs = await import("node:fs/promises");
    const stat = await fs.stat(outputPath);
    console.log(
      `${src} (${before.width}x${before.height}) -> ${out} (${(stat.size / 1024).toFixed(0)} KB)`
    );
  }
}

main();
