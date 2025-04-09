/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
                protocol: 'https',
                hostname: 'm.media-amazon.com', // For IMDb images
            },
            {
                protocol: 'https',
                hostname: 'image.tmdb.org', // For TMDB
            },
            {
                protocol: 'http',
                hostname: 'localhost', // For local development
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1', // For local development
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com', // For avatars
            }
        ]
    },
}

module.exports = nextConfig