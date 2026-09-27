import type { Metadata } from "next";
import { Nunito, Nunito_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  weight: ["700", "800", "900"],
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hornito · Pedidos anticipados con IA para tu local gastronómico",
  description:
    "Hornito es el asistente con IA que toma pedidos anticipados por vos: catálogo, horarios y confirmaciones, sin perder tiempo en WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} ${nunitoSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-crema text-cafe">{children}</body>
    </html>
  );
}
