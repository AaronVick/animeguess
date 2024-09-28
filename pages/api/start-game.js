import { fetchAnimeData } from './animeService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { title, imageUrl } = await fetchAnimeData();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-vercel-url.vercel.app';

    const state = {
      correctTitle: title,
      stage: 'question',
      totalAnswered: 0,
    };

    const html = `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/og?imageUrl=${encodeURIComponent(imageUrl)}" />
          <meta property="fc:frame:button:1" content="${title}" />
          <meta property="fc:frame:button:2" content="Another Anime Title" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
          <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify(state))}" />
        </head>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game.' });
  }
}
