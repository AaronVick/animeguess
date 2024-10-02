import Head from 'next/head';

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-vercel-url.com';
  const shareText = encodeURIComponent(`Check out this awesome Anime Guessing Game!\n\nFrame by @aaronv.eth`);
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;

  return (
    <div>
      <Head>
        <title>Anime Guessing Game</title>
        <meta name="description" content="A fun game to guess anime titles from images and descriptions" />
        <meta property="og:title" content="Anime Guessing Game" />
        <meta property="og:description" content="Test your knowledge of anime titles and characters" />
        <meta property="og:image" content={`${baseUrl}/animeGame.png`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${baseUrl}/animeGame.png`} />
        <meta property="fc:frame:button:1" content="Play Game" />
        <meta property="fc:frame:button:2" content="Share" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content={shareLink} />
        <meta property="fc:frame:post_url" content={`${baseUrl}/api/start-game`} />
      </Head>
      <h1>Anime Guessing Game</h1>
      <img
        src="/animeGame.png"
        alt="Anime Guessing Game"
        width="600"
        height="300"
      />
    </div>
  );
}
