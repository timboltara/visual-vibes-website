/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/visual-vibes-website",
  assetPrefix: "/visual-vibes-website",
  env: {
    NEXT_PUBLIC_BASEPATH: "/visual-vibes-website",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "visualvibesllc.com" },
    ],
  },
};

export default nextConfig;
