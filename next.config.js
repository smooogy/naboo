/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during builds (user has local eslintrc with missing deps)
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
