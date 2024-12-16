'use client';

import localFont from "next/font/local";
import "./globals.css";
import { DashboardWrappers } from "./DashboardWrappers";
import { usePathname } from "next/navigation";
import StoreProvider from "../app/redux"; // Asegúrate de importar StoreProvider correctamente
import { PropsWithChildren } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  // Verifica si la ruta actual corresponde al login
  const isAuthRoute = pathname === '/' || pathname?.startsWith('/login');

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Usamos StoreProvider para envolver la aplicación */}
        <StoreProvider>
          {isAuthRoute ? (
            // Si está en la ruta "/login", no muestra el DashboardWrappers
            <>{children}</>
          ) : (
            // Muestra el DashboardWrappers para todas las demás rutas
            <DashboardWrappers>{children}</DashboardWrappers>
          )}
        </StoreProvider>
      </body>
    </html>
  );
}