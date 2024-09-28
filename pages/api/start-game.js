import { fetchCharacterData } from './animeService';

export default async function handler(req, res) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://animeguess.vercel.app';
    
    // Fetch the character data from the anime API
    const { characterName, description, image } = await fetchCharacterData();

    console.log('Fetched character data:', { characterName, description, image });

    // Create the game response with the question and correct/wrong buttons
    const html = `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/og?characterName=${encodeURIComponent(characterName)}&description=${encodeURIComponent(description)}&image=${encodeURIComponent(image)}" />
          <meta property="fc:frame:button:1" content="${characterName}" />
          <meta property="fc:frame:button:2" content="Not ${characterName}" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/answer" />
          <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ correctTitle: characterName, stage: 'question' }))}" />
        </head>
        <body></body>
      </html>
    `;

    // Send the HTML response to the game
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in start-game handler:', error);

    // Provide error-specific HTML to inform the user
    const errorHtml = `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/og?message=${encodeURIComponent('An error occurred. Please try again.')}" />
          <meta property="fc:frame:button:1" content="Try Again" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/start-game" />
        </head>
        <body></body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(errorHtml);
  }
}
