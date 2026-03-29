/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production"

const nextConfig = isProduction
  ? {
      basePath: "/abhedya",
    }
  : {}

export default nextConfig
