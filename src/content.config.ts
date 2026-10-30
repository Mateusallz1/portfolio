import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Schema para Artigos de Blog (Long-form Technical Articles)
 * Inclui validação de tamanho de texto para SEO, datas e validação de consistência cronológica.
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) =>
    z
      .object({
        title: z
          .string()
          .min(5, 'O título do artigo deve conter no mínimo 5 caracteres.')
          .max(120, 'O título do artigo não deve exceder 120 caracteres para manter boa legibilidade.'),
        description: z
          .string()
          .min(20, 'A descrição deve ter pelo menos 20 caracteres para garantir um bom resumo no OpenGraph e motores de busca.')
          .max(250, 'A descrição não deve exceder 250 caracteres para evitar corte em redes sociais.'),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        lang: z.enum(['pt', 'en']),
        tags: z
          .array(z.string().min(1, 'Tag não pode ser vazia'))
          .min(1, 'Informe pelo menos uma tag técnica para catalogação.'),
        readingTime: z
          .string()
          .regex(/^\d+\s+min$/, 'O tempo de leitura deve seguir o padrão "X min" (ex: "5 min").'),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        coverImage: image().optional(),
        coverAlt: z.string().optional(),
      })
      .refine(
        (data) => !data.updatedDate || data.updatedDate >= data.pubDate,
        {
          message: 'A data de atualização (updatedDate) deve ser igual ou posterior à data de publicação (pubDate).',
          path: ['updatedDate'],
        }
      ),
});

/**
 * Schema para Notas do Digital Garden (Atomic Notes & Cheatsheets)
 * Foco em anotações rápidas e snippets de engenharia.
 */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z
      .string()
      .min(3, 'O título da nota deve ter no mínimo 3 caracteres.')
      .max(140, 'O título da nota não deve ultrapassar 140 caracteres.'),
    pubDate: z.coerce.date(),
    lang: z.enum(['pt', 'en']),
    category: z.string().min(2, 'A categoria deve ter ao menos 2 caracteres.'),
    tags: z
      .array(z.string().min(1))
      .min(1, 'Adicione pelo menos uma tag à anotação.'),
    draft: z.boolean().default(false),
  }),
});

/**
 * Schema para Projetos / Estudos de Caso (Case Studies)
 * Valida links de repositório, métricas quantitativas e tecnologias aplicadas.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(3, 'O título do projeto é obrigatório.'),
      description: z
        .string()
        .min(20, 'Forneça uma descrição de ao menos 20 caracteres para contextualizar o projeto.')
        .max(300),
      lang: z.enum(['pt', 'en']),
      role: z.string().min(2, 'Defina o papel desempenhado no projeto.'),
      order: z.number().int().default(0),
      featured: z.boolean().default(false),
      techs: z
        .array(z.string())
        .min(1, 'Pelo menos uma tecnologia deve ser listada.'),
      metrics: z.array(z.string()).optional(),
      githubUrl: z.string().url('A URL do GitHub deve ser um link HTTP/HTTPS válido.').optional(),
      liveUrl: z.string().url('A URL em produção deve ser um link HTTP/HTTPS válido.').optional(),
      coverImage: image().optional(),
    }),
});

export const collections = { articles, notes, projects };
