import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();
import presentation from '../data/presentation';

export async function GET(context) {
  const posts = (await getCollection('posts')).sort(function (first, second) {
    return second.data.publishedAt.getTime() - first.data.publishedAt.getTime();
  });;
  return rss({
    // `<title>` field in output xml
    title: 'Bambooom - Blah Blah Booooom',
    // `<description>` field in output xml
    description: 'PerPersonal Blog of Bamboo/Zhuzi',
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: posts.slice(0, 20).map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.description,
      customData: post.data.customData,
      link: `/posts/${post.slug}/`,
      author: `bambooom (${presentation.mail})`,
      content: sanitizeHtml(parser.render(post.body)),
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>
      <pubDate>${new Date()}</pubDate>
      <lastBuildDate>${new Date()}</lastBuildDate>
      <author>bambooom (${presentation.mail})</author>`,
  });
}
