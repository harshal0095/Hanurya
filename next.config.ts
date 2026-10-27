import type { NextConfig } from "next";

if (process.env.NODE_ENV === 'production') {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL must be set to the HTTPS production API URL before building.');
  }

  let productionApiUrl: URL;
  try {
    productionApiUrl = new URL(apiUrl);
  } catch {
    throw new Error('NEXT_PUBLIC_API_URL must be a valid HTTPS production API URL.');
  }
  if (
    productionApiUrl.protocol !== 'https:'
    || productionApiUrl.pathname.replace(/\/$/, '') !== '/api'
    || productionApiUrl.username
    || productionApiUrl.password
    || productionApiUrl.search
    || productionApiUrl.hash
    || ['localhost', '127.0.0.1'].includes(productionApiUrl.hostname)
  ) {
    throw new Error('NEXT_PUBLIC_API_URL must be an HTTPS API origin ending in /api, not a local address.');
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    ];

    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({ key: 'Strict-Transport-Security', value: 'max-age=31536000' });
    }

    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
