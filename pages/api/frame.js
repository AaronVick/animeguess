import { fetchCharacterData, fetchRandomCharacterNames } from './animeService';

export default async function handler(req, res) {
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;

  try {
    let html = '';
    const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-vercel-url.com';

    if (!state.stage || state.stage === 'initial') {
      const { characterName, description, image } = await fetchCharacterData();
      const [wrongAnswer] = await fetchRandomCharacterNames(1);
      
      const answers = [characterName, wrongAnswer].sort(() => 0.5 - Math.random());
      const correctIndex = answers.indexOf(characterName);

      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/og?description=${encodeURIComponent(description)}&image=${encodeURIComponent(image)}" />
            <meta property="fc:frame:button:1" content="${answers[0]}" />
            <meta property="fc:frame:button:2" content="${answers[1]}" />
            <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
            <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctTitle: characterName, correctIndex, stage: 'question' }))}" />
          </head>
          <body></body>
        </html>
      `;
    } else if (state.stage === 'question') {
      const isCorrect = buttonIndex === 1;
      const message = isCorrect ? `Correct!` : `Wrong.`;

      html = `
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent(message)}" />
            <meta property="fc:frame:button:1" content="Next Question" />
          </head>
          <body></body>
        </html>
      `;
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error("Error in frame handler:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
