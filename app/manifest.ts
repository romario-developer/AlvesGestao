import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alves Lava-Rápido',
    short_name: 'AlvesGestão',
    description: 'Sistema de gestão ágil para o Alves Lava-Rápido',
    start_url: '/',
    display: 'standalone', // Faz o app abrir sem a barra de endereços do navegador
    background_color: '#0f172a', // Uma cor escura puxada pro azul (Tailwind slate-900)
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}