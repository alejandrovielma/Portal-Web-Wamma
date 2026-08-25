// Script de ejemplo: arma la ficha de UNA especie combinando 3 fuentes
// gratuitas en vez de tenerlo hardcodeado a mano en los JSON de info/.
//
// Uso:
//   bun run scripts/fetch-species-data.mjs "Harpia harpyja" "Águila Harpía"
//
// Fuentes usadas:
//   - GBIF          -> taxonomia (phylum/class/order/family/genus)
//   - iNaturalist   -> foto real con licencia + estado de conservacion IUCN
//   - Wikipedia ES  -> descripcion en español
//
// Este script NO modifica nada en info/. Solo imprime el resultado y lo
// guarda en scripts/output/ para revisarlo. Para migrar el dataset
// completo usa migrate-fauna.mjs.

import { buildSpeciesRecord } from "./lib/species-sources.mjs";

async function main() {
  const scientificName = process.argv[2];
  const localName = process.argv[3];

  if (!scientificName) {
    console.error('Uso: bun run scripts/fetch-species-data.mjs "Nombre científico" ["Nombre local opcional"]');
    process.exit(1);
  }

  console.log(`Buscando "${scientificName}" en GBIF + iNaturalist + Wikipedia...`);
  const record = await buildSpeciesRecord(scientificName, localName);

  console.log(JSON.stringify(record, null, 2));

  const fs = await import("node:fs/promises");
  await fs.mkdir("scripts/output", { recursive: true });
  const fileName = `scripts/output/${scientificName.replace(/ /g, "_")}.json`;
  await fs.writeFile(fileName, JSON.stringify(record, null, 2));
  console.log(`\nGuardado en ${fileName}`);
}

main();
