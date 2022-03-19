/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'manim-sandbox-renderer-kddaq.ondigitalocean.app']
  }
}

module.exports = nextConfig
