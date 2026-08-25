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
}

export function NavHeader ({ pathItems }: HeaderProps) {
  const fullBreadcrumbs: BreadcrumbItem[] = [];

  if (pathItems && pathItems.length > 0) {
    fullBreadcrumbs.push(...pathItems);
  }

  return (
    <header className="bg-light-tertiary text-white flex items-center justify-between h-14 sm:h-20 fixed w-full z-50 px-2 sm:px-0">
      <TransitionToMenuButton
        href="/"
        className="flex items-center pl-1 sm:pl-6 cursor-pointer min-w-0 shrink-0"
      >
        <img src="logo.svg" alt="Logo Awani" className="h-6 sm:h-8 w-auto mr-2 sm:mr-4 shrink-0" />
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-semibold text-start whitespace-nowrap">Wamma</h1>
          <p className="hidden sm:block text-sm whitespace-nowrap">Aprendices del agua</p>
        </div>
      </TransitionToMenuButton>
      <div className="border-l border-white self-stretch my-3 sm:my-0 mx-2 sm:mx-4 shrink-0"></div>

      {fullBreadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="flex items-center text-xs sm:text-lg md:text-xl min-w-0 overflow-hidden">
          <TransitionToMenuButton href="/" className="text-white hover:underline shrink-0">
            Inicio
          </TransitionToMenuButton>
          <span className="mx-1 sm:mx-2 text-white shrink-0">&gt;</span>
          {fullBreadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <Link to={item.link} className="text-white hover:underline truncate">
                {item.nombre}
              </Link>
              {index < fullBreadcrumbs.length - 1 && (
                <span className="mx-1 sm:mx-2 text-white shrink-0">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <TransitionToMenuButton
        href="/"
        className="cursor-pointer ml-auto pr-1 sm:pr-6 pl-2 flex items-center shrink-0"
      >
        <img src="x.svg" alt="salir" className="h-5 sm:h-8 w-auto" />
      </TransitionToMenuButton>
    </header>
  );
};
