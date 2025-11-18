import type { NextConfig } from "next"
import withBundleAnalyzer from "@next/bundle-analyzer"

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env["ANALYZE"] === "true",
  openAnalyzer: true,
})

const plugins = [bundleAnalyzer]

const config = {
  reactStrictMode: true,
  serverExternalPackages: ["@node-rs/argon2"],
  productionBrowserSourceMaps: false,
  experimental: {
    cssChunking: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    optimizePackageImports: ["@yopem-ui/react-icons"],
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
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.pintudesa.com",
      },
      {
        protocol: "https",
        hostname: "*.pexels.com",
      },
    ],
  },
}
let finalConfig = { ...config } as NextConfig

for (const plugin of plugins) {
  finalConfig = plugin(finalConfig)
}

export default finalConfig
