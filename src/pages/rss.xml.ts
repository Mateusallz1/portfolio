import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { profile } from '../data/profile';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const sortedArticles = articles.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: `${profile.name} · Blog & Artigos`,
    description: profile.bio.pt,
    site: context.site?.toString() || 'https://gonzatools.com.br',
    items: sortedArticles.map((article) => {
      const slug = article.id.replace(/^(pt\/|en\/)/, '').replace(/\.(md|mdx)$/, '');
      return {
        title: article.data.title,
        pubDate: article.data.pubDate,
        description: article.data.description,
        link: `/${article.data.lang}/blog/${slug}`,
        categories: article.data.tags,
      };
    }),
    customData: `<language>pt-BR</language>`,
  });
}
