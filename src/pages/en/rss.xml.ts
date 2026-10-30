import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { profile } from '../../data/profile';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const enArticles = articles
    .filter((a) => a.data.lang === 'en')
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${profile.name} · Engineering Deep Dives (EN)`,
    description: profile.bio.en,
    site: context.site?.toString() || 'https://gonzatools.com.br',
    items: enArticles.map((article) => {
      const slug = article.id.replace(/^(en\/)/, '').replace(/\.(md|mdx)$/, '');
      return {
        title: article.data.title,
        pubDate: article.data.pubDate,
        description: article.data.description,
        link: `/en/blog/${slug}`,
        categories: article.data.tags,
      };
    }),
    customData: `<language>en-US</language>`,
  });
}
