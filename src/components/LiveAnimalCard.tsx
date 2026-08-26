import { LiveAnimalResult } from "#lib/liveSpeciesSearch.ts";
import UnitPostItInfo from "#components/UnitPostItInfo.tsx";

export function LiveAnimalCard({ result, handleDrag }: { result: LiveAnimalResult; handleDrag: (event: Event) => void }) {
  const taxonomyLine = [result.phylum, result.class, result.order, result.family, result.genus]
    .filter(Boolean)
    .join(" · ");

  const content = [
    { paragraphs: [result.description ?? "Todavía no hay una descripción disponible para esta especie."] },
    ...(taxonomyLine ? [{ subtitle: "Taxonomía", paragraphs: [taxonomyLine] }] : []),
    ...(result.globalConservationStatus
      ? [{
          subtitle: "Conservación",
          paragraphs: [
            `Estado global: ${result.globalConservationStatus}`,
            "No es específico de Venezuela — solo las especies del Acuario tienen ese dato nacional.",
          ],
        }]
      : []),
    ...(result.observationsInVenezuela > 0
      ? [{ paragraphs: [`📍 ${result.observationsInVenezuela} avistamiento(s) registrados en Venezuela (iNaturalist)`] }]
      : []),
  ];

  return (
    <div className="w-full">
      <UnitPostItInfo
        dimensions={{ w: 2, h: 3 }}
        handleEvent={handleDrag}
        postItProds={{
          title: result.commonName ?? result.scientificName,
          content,
          images: result.image ? [result.image] : [],
          sourceUrl: result.sources.wikipedia ?? result.sources.inaturalist ?? result.sources.gbif ?? undefined,
        }}
      />
    </div>
  );
}

export default LiveAnimalCard;
