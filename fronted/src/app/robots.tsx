import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/account/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.crownhairfibers.com'}/sitemap.xml`,
  }
} 