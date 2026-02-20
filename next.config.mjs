import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true
});

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    turbopack: {},
    compiler: {
        removeConsole: process.env.NODE_ENV === "production"
    },
    webpack: (config) => {
        // Solana Polyfills for Webpack 5
        config.resolve.fallback = {
            ...config.resolve.fallback,
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            assert: require.resolve('assert'),
            zlib: require.resolve('browserify-zlib'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify'),
            url: require.resolve('url'),
        };
        return config;
    },
};

export default withPWA(nextConfig);
