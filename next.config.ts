import NextConfig from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

const sentryConfig = {
  org: "marxel",
  project: "web",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

module.exports =
  process.env.NODE_ENV === "development"
    ? nextConfig
    : withSentryConfig(nextConfig, sentryConfig);
