import React from 'react';
import { BreadcrumbItem } from './breadcrumbs'; // Asegúrate de que la ruta sea correcta
import LogoAwani from './logo-awani.png'; // Importa tu logo (reemplaza con la ruta real)

interface HeaderProps {
  breadcrumbs: BreadcrumbItem[];
  titulo?: string; // Prop opcional para el título
}

export const Header: React.FC<HeaderProps> = ({ breadcrumbs, titulo = "Título" }) => {
  return (
    <header className="bg-blue-500 text-white py-4 px-6 flex items-center justify-between">
      {/* Sección izquierda: Logo y texto */}
      <div className="flex items-center">
        <img src={LogoAwani} alt="Logo Awani" className="h-8 w-auto mr-4" /> {/* Ajusta el tamaño del logo */}
        <div>
          <h1 className="text-lg font-semibold">Wamma</h1>
          <p className="text-sm">Aprendices del agua</p>
        </div>
      </div>

      {/* Sección central: Título */}
      <h2 className="text-xl font-semibold">{titulo}</h2>

      {/* Sección derecha: "X" (puedes usar un icono o texto) */}
      <span className="text-2xl cursor-pointer">X</span>

      {/* (Opcional) Migas de pan - puedes posicionarlas donde prefieras */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="absolute bottom-2 left-6 text-sm">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <li key={index}>
                <a href={item.link} className="text-white hover:underline">
                  {item.nombre}
                </a>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-white">&gt;</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </header>
  );
};