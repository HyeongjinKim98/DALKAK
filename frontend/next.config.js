// const { StrictMode } = require('react');

const nextConfig = {
  reactStrictMode: true,
  distDir: 'build',
  output: 'export',
  trailingSlash: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    loader: 'custom',
    loaderFile: './image-loader.ts',

    remotePatterns: [
      // 재료, 도구 이미지 경로
      {
        protocol: 'https',
        hostname: 'kr.object.ncloudstorage.com',
        port: '',
        pathname: '/dalkak/basic/**',
      },
      // 앱솔루트 이미지 경로
      {
        protocol: 'https',
        hostname: 'images.absolutdrinks.com',
        port: '',
        pathname: '/drink-images/**',
      },
      // iba 이미지 경로
      {
        protocol: 'https',
        hostname: 'i.namu.wiki',
        port: '',
        pathname: '/i/**',
      },
    ],
  },
};

module.exports = nextConfig;
