import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { profile } from '../../data/profile';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const ptArticles = articles
    .filter((a) => a.data.lang === 'pt')
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${profile.name} · Artigos Técnicos (PT)`,
    description: profile.bio.pt,
    site: context.site?.toString() || 'https://gonzatools.com.br',
    items: ptArticles.map((article) => {
      const slug = article.id.replace(/^(pt\/)/, '').replace(/\.(md|mdx)$/, '');
      return {
        title: article.data.title,
        pubDate: article.data.pubDate,
        description: article.data.description,
        link: `/pt/blog/${slug}`,
        categories: article.data.tags,
      };
    }),
    customData: `<language>pt-BR</language>`,
  });
}
