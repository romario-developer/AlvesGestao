import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alves Lava-Rápido",
  description: "Gestão ágil de serviços automotivos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Barra Superior */}
        <header className="bg-slate-900 text-white shadow-md border-b-4 border-red-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                {/* Aqui futuramente podemos colocar a logo redonda */}
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold text-sm">
                  AL
                </div>
                <span className="font-bold text-xl tracking-wider">
                  ALVES <span className="text-red-500">LAVA-RÁPIDO</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal onde vão entrar as telas */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}