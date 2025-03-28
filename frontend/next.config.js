/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'm.media-amazon.com', // For IMDb images
            'image.tmdb.org', // If you're using TMDB
            'localhost', // For local development
            '127.0.0.1', // For local development
            'ui-avatars.com', // Add this
        ],
        // You can also use a more flexible pattern with remotePatterns
        remotePatterns: [{
            protocol: 'https',
            hostname: '**', // Allow all domains (use with caution)
        }]
    },
}

module.exports = nextConfig