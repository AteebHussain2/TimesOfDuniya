import { GetAllPublishedPosts } from '@/actions/site/posts/getAllPublishedPosts'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await GetAllPublishedPosts()
    const links: MetadataRoute.Sitemap = [
        {
            url: 'https://times-of-duniya.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },

    ]

    const categories = ['international', 'anime', 'pakistan', 'politics', 'business', 'technology', 'sports', 'health', 'entertainment']
    for (const category of categories) {
        links.push({
            url: `https://times-of-duniya.vercel.app/category/${category}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        })
    }

    for (const post of posts) {
        links.push({
            url: `https://times-of-duniya.vercel.app/post/${post.id}/${post.slug}`,
            lastModified: post.publishedAt!,
            changeFrequency: 'weekly',
            priority: 0.8,
        })
    }

    return links
}
