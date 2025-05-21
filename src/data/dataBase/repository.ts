import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";
import { PostItMapProps } from "#components/PostIts/PostItMap.tsx";
import projectsData from "#info/projects.json";
import proposalsData from "#info/proposals.json";
import articlesData from "#info/articles.json";
import worksData from "#info/works.json";
import animalsData from "#info/faunachordata new.json";
import destinationsData from "#info/destinations.json";
import locationsData from "#info/locations.json";

const articles: PostItInfoProps[] = articlesData.map((article) => ({
  ...article,
}));

export function getLastArticles(count: number): PostItInfoProps[] {
  return articles.slice(-count);
}

export function getAllArticles(): PostItInfoProps[] {
  return articles;
}

export interface Work {
  type: string;
  content: PostItInfoProps;
}

const works: Work[] = worksData.map((work) => ({
  type: work.type,
  content: {
    title: work.title,
    content: work.content,
    images: work.images,
    video: work.video,
  },
}));

export function getLastWorks(count: number): Work[] {
  return works.slice(-count);
}

export interface Destination {
  type: string;
  content: PostItMapProps;
}

const destinations: Destination[] = destinationsData.map((destination) => ({
  type: destination.type,
  content: {
    title: destination.title,
    description: destination.description,
    images: destination.images,
    video: destination.video,
    coordinates: {
      lat: destination.coordinates.lat,
      lng: destination.coordinates.lng,
    },
    city: destination.city,
  },
}));

export function getAllDestinations(): Destination[] {
  return destinations;
}

const projects: PostItInfoProps[] = projectsData.map((project) => ({
  ...project,
}));

export function getLastProjects(count: number): PostItInfoProps[] {
  return projects.slice(-count);
}

export function getAllProjects(): PostItInfoProps[] {
  return projects;
}

//Propuestas

const proposals: PostItInfoProps[] = proposalsData.map((proposal) => ({
  ...proposal,
}));

export function getLastProposals(count: number): PostItInfoProps[] {
  return proposals.slice(-count);
}

export function getAllProposals(): PostItInfoProps[] {
  return proposals;
}

export interface Animal {
  class: string;
  scientificName: string;
  commonName: string;
  locations: string[];
  content: PostItInfoProps;
}

const animals: Animal[] = animalsData.map(
  (animal): Animal => ({
    class: animal.class,
    scientificName: animal.scientificName,
    commonName: animal.name, // Se usa el campo 'name' como nombre común
    locations: animal.locations || [], // Extrae directamente el arreglo de locaciones
    content: {
      title: animal.name,
      content: [
        {
          paragraphs: [animal.description],
        },
        {
          subtitle: "Taxonomía",
          paragraphs: [
            `Filo: ${animal.phylum}`,
            `Clase: ${animal.class}`,
            `Orden: ${animal.order}`,
            `Familia: ${animal.family}`,
            `Género: ${animal.genus}`,
          ],
        },
        {
          subtitle: "Distribución",
          paragraphs: [animal.distribution],
        },
        {
          subtitle: "Situación",
          paragraphs: [animal.situation ?? "Sin información disponible"],
        },
        {
          subtitle: "Peligro",
          paragraphs: [animal.danger ?? "Sin información disponible"],
        },
        {
          subtitle: "Conservación",
          paragraphs: [animal.conservation ?? "Sin información disponible"],
        },
      ],
      images: [
        "https://www.especiesamenazadas.org" + animal.image,
        "https://www.especiesamenazadas.org" + animal.imageDistribution,
      ].filter(Boolean), // Elimina cualquier undefined o string vacío
    },
  })
);

export function getAllAnimals(): Animal[] {
  return animals;
}

// Locaciones para los animales

export interface MapLocation {
  name: string;
  color: string;
  bonds: [number, number][];
}

const locations: MapLocation[] = locationsData.map((location) => ({
  name: location.name,
  color: location.color,
  bonds: location.bonds.map(
    (bond) => [bond[0], bond[1]] as [number, number]
  ),
}));

export function getAllLocations(): MapLocation[] {
  return locations;
}
