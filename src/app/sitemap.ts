import { GetAllPublishedPosts } from '@/actions/site/posts/getAllPublishedPosts'
import { GetCategories } from '@/actions/site/categories/getCategories'
import { GetAllAuthors } from '@/actions/site/authors/getAllAuthors'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await GetAllPublishedPosts()
    const categories = await GetCategories()
    const authors = await GetAllAuthors()

    const links: MetadataRoute.Sitemap = [
        {
            url: 'https://times-of-duniya.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: 'https://times-of-duniya.vercel.app/search',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },

        // Dashboard:
        {
            url: 'https://times-of-duniya.vercel.app/dashboard',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://times-of-duniya.vercel.app/content',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://times-of-duniya.vercel.app/content/create',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://times-of-duniya.vercel.app/content/edit',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://times-of-duniya.vercel.app/categories',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://times-of-duniya.vercel.app/users',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ]

    for (const author of authors) {
        links.push({
            url: `https://times-of-duniya.vercel.app/author/${author.username}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        })
    }

    for (const category of categories) {
        links.push({
            url: `https://times-of-duniya.vercel.app/category/${category.slug}`,
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
