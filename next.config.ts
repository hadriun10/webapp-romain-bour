import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisation des images
  images: {
    domains: ['dzfppthjtzonegelebkq.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Compression
  compress: true,
  
  // Optimisation pour la production
  swcMinify: true,
  
  // Variables d'environnement publiques
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
