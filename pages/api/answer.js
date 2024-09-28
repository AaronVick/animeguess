export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://guess-the-artist.vercel.app';
    const { untrustedData } = req.body;
    const buttonIndex = untrustedData?.buttonIndex;
    const correctAnime = untrustedData?.state?.correctAnime;
    const totalAnswered = (untrustedData?.state?.totalAnswered || 0) + (buttonIndex === 1 ? 1 : 0);
  
    const isCorrect = buttonIndex === 1;
    const message = isCorrect
      ? `Correct! You've guessed ${totalAnswered} anime titles correctly.`
      : `Wrong. The correct answer was ${correctAnime}. You've guessed ${totalAnswered} titles correctly.`;
  
    const shareText = encodeURIComponent(`I guessed ${totalAnswered} anime titles correctly in the Anime Guess Game! Frame by @aaronv.eth`);
    const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(baseUrl)}`;
  
    res.status(200).json({
      version: 'vNext',
      image: `${baseUrl}/api/og?message=${encodeURIComponent(message)}`,
      buttons: [
        { label: 'Next Anime' },
        { label: 'Share', action: 'link', target: shareLink },
      ],
      post_url: `${baseUrl}/api/quote`,
    });
  }
  