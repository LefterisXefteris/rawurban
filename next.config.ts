import type { NextConfig } from "next";

const defaultShopifyDomain = "52ps1h-0t.myshopify.com";
const shopifyCheckoutHost =
  process.env.SHOPIFY_CHECKOUT_DOMAIN ??
  process.env.SHOPIFY_STORE_DOMAIN ??
  defaultShopifyDomain;

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
        source: "/cart/:path*",
        destination: "/api/checkout/cart/:path*",
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
