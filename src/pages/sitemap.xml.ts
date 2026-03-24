import type { APIRoute } from 'astro';
import { realisations } from '../data/realisations';
import { SITE_URL } from '../config';

const BASE = SITE_URL;
const today = new Date().toISOString().split('T')[0];

const pages = [
  { url: '/',              changefreq: 'weekly',  priority: '1.0' },
  { url: '/services/',     changefreq: 'monthly', priority: '0.8' },
  { url: '/realisations/', changefreq: 'monthly', priority: '0.7' },
  { url: '/a-propos/',     changefreq: 'monthly', priority: '0.6' },
  { url: '/contact/',      changefreq: 'monthly', priority: '0.8' },
  ...realisations.map(r => ({
    url: `/realisations/${r.slug}/`,
    changefreq: 'monthly',
    priority: '0.6',
  })),
];

export const GET: APIRoute = () => {
  const urls = pages
    .map(
      ({ url, changefreq, priority }) => `
  <url>
    <loc>${BASE}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('');

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(content, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
