import { fetchAnimeData } from '../../utils/animeService'; // Importing your anime service

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;  // Using environment variables for dynamic setup
  const { animeQuestion, correctOption, wrongOption } = await fetchAnimeData();  // Fetching the data

  res.status(200).json({
    version: 'vNext',
    image: `${baseUrl}/api/og?description=${encodeURIComponent(animeQuestion)}`,
    buttons: [
      { label: correctOption },
      { label: wrongOption }
    ],
    post_url: `${baseUrl}/api/answer`,
  });
}
