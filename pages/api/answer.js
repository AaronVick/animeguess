import { fetchAnimeData } from './animeService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://animeguess.vercel.app';
  const { untrustedData } = req.body;
  const buttonIndex = untrustedData?.buttonIndex;
  const state = JSON.parse(decodeURIComponent(untrustedData?.state || '{}'));
  const { correctTitle, totalAnswered = 0, correctCount = 0 } = state;

  try {
    let html;
    if (buttonIndex) {
      // This is the answer to a question
      const newTotalAnswered = totalAnswered + 1;
      const isCorrect = buttonIndex === 1;
      const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
      const message = isCorrect 
        ? `Correct! The anime was ${correctTitle}. You've guessed ${newCorrectCount} anime titles correctly out of ${newTotalAnswered}.` 
        : `Wrong. The correct anime was ${correctTitle}. You've guessed ${newCorrectCount} anime titles correctly out of ${newTotalAnswered}.`;

      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent(message)}" />
    <meta property="fc:frame:button:1" content="Next Anime" />
    <meta property="fc:frame:button:2" content="Share" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="${baseUrl}/share" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ totalAnswered: newTotalAnswered, correctCount: newCorrectCount }))}" />
  </head>
  <body></body>
</html>`;
    } else {
      // New anime question with wrong option
      const { title, synopsis, image, wrongAnime } = await fetchAnimeData();

      html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/og?title=${encodeURIComponent(title)}&synopsis=${encodeURIComponent(synopsis)}&image=${encodeURIComponent(image || '')}" />
    <meta property="fc:frame:button:1" content="${title}" />
    <meta property="fc:frame:button:2" content="${wrongAnime}" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
    <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctTitle: title, totalAnswered, correctCount }))}" />
  </head>
  <body></body>
</html>`;
    }

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in answer handler:', error);
    res.status(500).send('An error occurred. Please try again.');
  }
}
