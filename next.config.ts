import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {},
};

export default withPWA({
  dest: "public",
  register: true,
  disable: isDev,
})(nextConfig);
