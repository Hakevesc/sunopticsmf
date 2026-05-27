import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sibxvfszhopnpvnaoiha.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default withNextIntl(nextConfig);