// Migra TODO el dataset de fauna (info/faunachordata new.json) para que
// la taxonomia, foto, estado de conservacion y descripcion vengan de
// GBIF + iNaturalist + Wikipedia en vez de estar copiadas a mano.
//
// distribution / locations / imageDistribution se conservan del JSON
// viejo (ninguna API publica los cubre igual de especifico).
//
// Uso:
//   bun run scripts/migrate-fauna.mjs
//
// NO sobreescribe info/faunachordata new.json directamente. Escribe el
// resultado en scripts/output/faunachordata-migrated.json para que lo
// revises antes de reemplazar el archivo real.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { buildSpeciesRecord } from "./lib/species-sources.mjs";

const SOURCE_FILE = "info/faunachordata new.json";
const OUTPUT_FILE = "scripts/output/faunachordata-migrated.json";
const DELAY_MS = 350; // cortesia con las APIs gratuitas entre cada especie

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const raw = await readFile(SOURCE_FILE, "utf-8");
  const oldData = JSON.parse(raw);

  console.log(`Migrando ${oldData.length} especies desde "${SOURCE_FILE}"...\n`);

  const results = [];
  const failures = [];

  for (let i = 0; i < oldData.length; i++) {
    const oldRecord = oldData[i];
    const label = `[${i + 1}/${oldData.length}] ${oldRecord.scientificName}`;
    console.log(label);

    try {
      const record = await buildSpeciesRecord(
        oldRecord.scientificName,
        oldRecord.name,
        oldRecord
      );

      // avisar si alguna fuente no encontro nada, para revisar a mano despues
      const gaps = [];
      if (!record.phylum) gaps.push("taxonomia (GBIF no encontro match)");
      if (!record.image) gaps.push("imagen (iNaturalist/Wikipedia no tienen foto)");
      if (!record.description) gaps.push("descripcion (Wikipedia no tiene articulo)");
      if (gaps.length > 0) {
        console.log(`  ⚠ faltante: ${gaps.join(", ")}`);
      }

      results.push(record);
    } catch (e) {
      console.error(`  ✗ fallo completo: ${e.message}`);
      failures.push({ scientificName: oldRecord.scientificName, error: e.message });
      results.push(oldRecord); // conserva el registro viejo tal cual si todo falla
    }

    if (i < oldData.length - 1) await sleep(DELAY_MS);
  }

  await mkdir("scripts/output", { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2), "utf-8");

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Listo: ${results.length} especies procesadas.`);
  console.log(`Guardado en ${OUTPUT_FILE}`);
  if (failures.length > 0) {
    console.log(`\n${failures.length} especies fallaron por completo y quedaron con su dato viejo:`);
    failures.forEach((f) => console.log(`  - ${f.scientificName}: ${f.error}`));
  }
  console.log(`\nEsto NO reemplazo "${SOURCE_FILE}" todavia -- revisa el output primero.`);
}

main();
