import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://fuelpulse.troypoulter.com',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://fuelpulse.troypoulter.com/search',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://fuelpulse.troypoulter.com/analytics',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        }
    ]
}