/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'yce-us.s3-accelerate.amazonaws.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ]
  }
}

module.exports = nextConfig
