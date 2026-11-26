import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const siteUrl = (context.site?.href ?? 'http://localhost:4321').replace(/\/+$/, '');
  const robotsTxt = `User-agent: *\nSitemap: ${siteUrl}/sitemap.xml\n`;
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
