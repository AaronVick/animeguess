export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { untrustedData } = req.body;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  const buttonIndex = untrustedData?.buttonIndex;

  let html = '';
  const isCorrect = buttonIndex === 1;
  const totalAnswered = (state.totalAnswered || 0) + 1;
  const message = isCorrect
    ? `Correct! The anime was ${state.correctTitle}.`
    : `Wrong! The correct answer was ${state.correctTitle}.`;

  const shareText = encodeURIComponent(`I guessed ${totalAnswered} anime correctly!`);
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}`;

  html = `
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?message=${encodeURIComponent(message)}" />
        <meta property="fc:frame:button:1" content="Next Anime" />
        <meta property="fc:frame:button:2" content="Share" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="${shareLink}" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
        <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered, stage: 'result' }))}" />
      </head>
      <body>
        <h1>${message}</h1>
      </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
