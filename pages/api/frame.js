import { fetchAnimeData } from './animeService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { untrustedData } = req.body;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  const buttonIndex = untrustedData?.buttonIndex;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-vercel-url.vercel.app';

  try {
    let html = '';
    if (state.stage === 'question') {
      const correctTitle = state.correctTitle;
      const selectedTitle = buttonIndex === 1 ? correctTitle : 'Another Anime Title';
      const isCorrect = selectedTitle === correctTitle;

      const totalAnswered = (state.totalAnswered || 0) + (isCorrect ? 1 : 0);
      const message = isCorrect ? `Correct!` : `Wrong! The correct answer was ${correctTitle}`;

      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent(message)}" />
            <meta property="fc:frame:button:1" content="Next Anime" />
            <meta property="fc:frame:button:2" content="Share" />
            <meta property="fc:frame:button:2:action" content="link" />
            <meta property="fc:frame:button:2:target" content="https://warpcast.com/~/compose?text=I guessed ${totalAnswered} anime correctly!" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered, stage: 'next' }))}" />
          </head>
        </html>
      `;
    }
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error handling frame:', error);
    res.status(500).json({ error: 'Error generating frame.' });
  }
}
