import type { NextConfig } from "next";

const shopifyCheckoutHost =
  process.env.SHOPIFY_STORE_DOMAIN ?? "rawurban-3.myshopify.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 h
  },
  async redirects() {
    return [
      {
        source: "/cart/c/:path*",
        destination: `https://${shopifyCheckoutHost}/checkouts/c/:path*`,
        permanent: false,
      },
      {
        source: "/checkouts/c/:path*",
        destination: `https://${shopifyCheckoutHost}/checkouts/c/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
