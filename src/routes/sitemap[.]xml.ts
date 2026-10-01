import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://kimote.hassanmageye.com";

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
      <image:loc>${SITE_URL}/__l5e/assets-v1/e3dd87b1-033a-4d5a-9c56-a813bc57196e/kimote-poster.jpg</image:loc>
      <image:title>Kimote (2025) official poster</image:title>
    </image:image>
    <video:video>
      <video:thumbnail_loc>${SITE_URL}/__l5e/assets-v1/e3dd87b1-033a-4d5a-9c56-a813bc57196e/kimote-poster.jpg</video:thumbnail_loc>
      <video:title>Kimote Official Trailer</video:title>
      <video:description>Watch the official trailer for Kimote (2025), a film by Hassan Mageye about barkcloth, cultural inheritance, and the courage to reinvent tradition.</video:description>
      <video:content_loc>https://pub-eb00261df49f466a9e5efee154650b48.r2.dev/trailers/80f921c5-2b36-4daa-92fd-1c88f2452c21-KIMOTE_OFFICIAL_TRAILER.mp4</video:content_loc>
      <video:player_loc>${SITE_URL}/</video:player_loc>
      <video:duration>131</video:duration>
    </video:video>
  </url>
</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
