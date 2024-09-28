import { fetchAnimeData, fetchRandomAnimeTitles } from './animeService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-vercel-url.com';
    const { title, synopsis, image } = await fetchAnimeData();
    const wrongAnswers = await fetchRandomAnimeTitles(2); // Fetch two random wrong answers

    // Add the correct answer to the mix
    const answers = [title, ...wrongAnswers].sort(() => 0.5 - Math.random()); // Randomize the order

    const html = `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/og?title=${encodeURIComponent(title)}&synopsis=${encodeURIComponent(synopsis)}&image=${encodeURIComponent(image || '')}" />
          <meta property="fc:frame:button:1" content="${answers[0]}" />
          <meta property="fc:frame:button:2" content="${answers[1]}" />
          <meta property="fc:frame:button:3" content="${answers[2]}" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
        </head>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
