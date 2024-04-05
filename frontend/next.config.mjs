// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  webpack: (config) => {
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias['@'] = path.resolve(__dirname, './styles');
    return config;
  },
};

export default nextConfig;
