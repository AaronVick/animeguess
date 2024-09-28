import { fetchAnime } from '../../utils/animeService';

export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-artist.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;

  try {
    let html = '';
    const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));

    if (!state.stage || state.stage === 'initial') {
      const { correctAnime, description, imageUrl, wrongAnime } = await fetchAnime();

      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/og?description=${encodeURIComponent(description)}&image=${encodeURIComponent(imageUrl)}" />
            <meta property="fc:frame:button:1" content="${correctAnime}" />
            <meta property="fc:frame:button:2" content="${wrongAnime}" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctAnime, wrongAnime, totalAnswered: 0, stage: 'question' }))}" />
          </head>
        </html>
      `;
    } else {
      // Logic for processing the user's answer
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in frame handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
