/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://website-madras-production.up.railway.app'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tiny.cloud https://*.tinymce.com; style-src 'self' 'unsafe-inline' https://cdn.tiny.cloud https://*.tinymce.com; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https://*.tinymce.com https://cdn.tiny.cloud; frame-ancestors 'self' https://website-madras-production.up.railway.app; frame-src 'self' https://website-madras-production.up.railway.app;"
          }
        ]
      }
    ]
  },
  // Add development-specific configuration
  webpack: (config, { dev, isServer }) => {
    // Add development-specific webpack configuration
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  // Add experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ['website-madras-production.up.railway.app'],
      bodySizeLimit: '2mb'
    },
    serverComponentsExternalPackages: ['bcryptjs']
  }
}

module.exports = nextConfig 