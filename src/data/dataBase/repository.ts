import { PostItInfoProps } from "#components/PostIts/PostItInfo.tsx";
import { PostItMapProps } from "#components/PostIts/PostItMap.tsx";
import articlesData from "#info/articles.json"
import worksData from "#info/works.json"
import animalsData from "#info/faunaVenezuelaChordata.json";
import destinationsData from "#info/destinations.json"
import { PostItInfoAnimalsProps } from "#components/PostIts/PostItInfoAnimals.tsx";

const articles: PostItInfoProps[] = articlesData.map(article => ({
    ...article
}));

export function getLastArticles(count: number): PostItInfoProps[] {
    return articles.slice(-count);
}

export function getAllArticles(): PostItInfoProps[] {
    return articles;
}

export interface Work {
    type: string;
    content: PostItInfoProps
}

const works: Work[] = worksData.map(work => ({
    type: work.type,
    content: {
        title: work.title,
        content: work.content,
        images: work.images,
        video: work.video,
    }
}));

export function getLastWorks(count: number): Work[] {
    return works.slice(-count);
}

export interface Destination{
    type: string;
    content: PostItMapProps
}

const destinations: Destination[] = destinationsData.map(destination => ({
    type: destination.type,
    content: {
        title: destination.title,
        description: destination.description,
        images: destination.images,
        video: destination.video,
        coordinates: {
            lat: destination.coordinates.lat,
            lng: destination.coordinates.lng
        },
        city: destination.city,
    }
}));

export function getAllDestinations(): Destination[] {
    return destinations;
}

const animals: PostItInfoProps[] = animalsData.map((animal): PostItInfoProps => ({
    title: animal.scientificName,
    content: [
        {
            paragraphs: [animal.description]
        },
        {
            subtitle: "Taxonomía",
            paragraphs: [
                `Filo: ${animal.phylum}`,
                `Clase: ${animal.class}`,
                `Orden: ${animal.order}`,
                `Familia: ${animal.family}`,
                `Género: ${animal.genus}`,
            ]
        },
        {
            subtitle: "Distribución",
            paragraphs: [animal.distribution]
        },
        {
            subtitle: "Situación",
            paragraphs: [animal.situation]
        },
        {
            subtitle: "Peligro",
            paragraphs: [animal.danger]
        },
        {
            subtitle: "Conservación",
            paragraphs: [animal.conservation]
        }
    ],
    images: [animal.image]
}));

export function getAllAnimals(): PostItInfoProps[] {
  return animals;
}
