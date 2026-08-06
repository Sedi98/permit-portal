import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporary local testing only. These values are embedded in the client bundle,
  // so this must not be enabled in a production deployment.
  env: {
    NEXT_APP_TEST_MODE: process.env.NEXT_APP_TEST_MODE,
    NEXT_APP_TEST_TOKEN: process.env.NEXT_APP_TEST_TOKEN,
  },
};

export default nextConfig;
