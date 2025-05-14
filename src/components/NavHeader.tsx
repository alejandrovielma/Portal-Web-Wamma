import React from "react";
import { Link } from "react-router-dom";
import { TransitionToMenuButton } from "./TransitionToMenuButton";

export interface BreadcrumbItem {
  nombre: string;
  link: string;
}

export function generateBreadcrumbs(
  segments: string[],
  baseUrl: string = "/"
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ nombre: "Inicio", link: baseUrl }];
  let currentPath = baseUrl;

  segments.forEach((segment) => {
    currentPath += (currentPath.endsWith("/") ? "" : "/") + segment;
    breadcrumbs.push({
      nombre:
        segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " "),
      link: currentPath,
    });
  });

  return breadcrumbs;
}

export function generateBreadcrumbsFromItems(
  items: { nombre: string; slug: string }[],
  baseUrl: string = "/"
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ nombre: "Inicio", link: baseUrl }];
  let currentPath = baseUrl;

  items.forEach((item) => {
    currentPath += (currentPath.endsWith("/") ? "" : "/") + item.slug;
    breadcrumbs.push({
      nombre: item.nombre,
      link: currentPath,
    });
  });

  return breadcrumbs;
}

interface HeaderProps {
  pathItems?: BreadcrumbItem[];
  titulo?: string;
}

export function NavHeader ({ pathItems, titulo }: HeaderProps) {
  const fullBreadcrumbs: BreadcrumbItem[] = [];
  if (titulo) {
    fullBreadcrumbs.push({ nombre: titulo, link: "/" });
  } else {
    fullBreadcrumbs.push({ nombre: "Inicio", link: "/" });
  }

  if (pathItems && pathItems.length > 0) {
    fullBreadcrumbs.push(...pathItems);
  }

  return (
    <header className="bg-blue-500 text-white flex items-stretch justify-between h-20 fixed w-full z-50">
      <TransitionToMenuButton
        href="/"
        className="flex items-center pl-6 cursor-pointer"
      >
        <img src="logo.svg" alt="Logo Awani" className="h-8 w-auto mr-4" />
        <div>
          <h1 className="text-lg font-semibold text-start">Wamma</h1>
          <p className="text-sm">Aprendices del agua</p>
        </div>
      </TransitionToMenuButton>
      <div className="border-l border-white self-stretch mx-4"></div>

      {fullBreadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="flex items-center text-xl">
          {fullBreadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <Link to={item.link} className="text-white hover:underline">
                {item.nombre}
              </Link>
              {index < fullBreadcrumbs.length - 1 && (
                <span className="mx-2 text-white">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <TransitionToMenuButton
        href="/"
        className="text-2xl cursor-pointer ml-auto pr-6 flex items-center"
      >
        <img src="x.svg" alt="salir" className="h-8 w-auto mr-4" />
      </TransitionToMenuButton>
    </header>
  );
};
