import type { NextConfig } from "next"
import withBundleAnalyzer from "@next/bundle-analyzer"

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env["ANALYZE"] === "true",
  openAnalyzer: true,
})

const plugins = [bundleAnalyzer]

const config = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  experimental: {
    cssChunking: true,
    serverSourceMaps: true,
    viewTransition: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    optimizePackageImports: ["@yopem-ui/react-icons"],
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  compiler: {
    ...(process.env.NODE_ENV === "production"
      ? {
          removeConsole: {
            exclude: ["error", "warn"],
          },
        }
      : {}),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.pexels.com",
      },
      {
        protocol: "https",
        hostname: "*.pintudesa.com",
      },
    ],
  },
}
let finalConfig = { ...config } as NextConfig

for (const plugin of plugins) {
  finalConfig = plugin(finalConfig)
}

export default finalConfig
