import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://kimote.hassanmageye.com";
const POSTER_PATH = "/__l5e/assets-v1/c4eb52cc-bf71-4d31-976a-b16bbf675f1e/devils-chest-poster.jpg";
const TRAILER_URL = "https://pub-eb00261df49f466a9e5efee154650b48.r2.dev/trailers/1845449e-73f5-4257-afa1-def6ae33c5d4-DEVIL_S_CHEST_-_Trailer_1080_.mp4";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${SITE_URL}${POSTER_PATH}</image:loc>
      <image:title>Devil's Chest official poster</image:title>
    </image:image>
    <video:video>
      <video:thumbnail_loc>${SITE_URL}${POSTER_PATH}</video:thumbnail_loc>
      <video:title>Devil's Chest Official Trailer</video:title>
      <video:description>Watch the official trailer for Devil's Chest, a film written and directed by Hassan Mageye.</video:description>
      <video:content_loc>${TRAILER_URL}</video:content_loc>
      <video:player_loc>${SITE_URL}/</video:player_loc>
      <video:duration>149</video:duration>
    </video:video>
  </url>
</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
