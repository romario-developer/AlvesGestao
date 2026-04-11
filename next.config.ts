import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Só ativa o PWA de verdade quando formos publicar
});

export default withPWA({
  // Aqui dentro você pode colocar outras configurações do Next.js no futuro, se precisar
});