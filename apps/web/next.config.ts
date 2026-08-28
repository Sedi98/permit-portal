import type { NextConfig } from "next";

const apiBaseUrlValue = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrlValue) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is required");
}

const apiBaseUrl = new URL(apiBaseUrlValue);
const imageProtocol =
  apiBaseUrl.protocol === "https:"
    ? "https"
    : apiBaseUrl.protocol === "http:"
      ? "http"
      : null;

if (!imageProtocol) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL must use http or https");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: imageProtocol,
        hostname: apiBaseUrl.hostname,
        port: apiBaseUrl.port,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
