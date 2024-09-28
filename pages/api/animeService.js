import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

// Fetch a random anime's title and description from the Jikan API
export async function fetchAnimeData() {
  try {
    const randomAnimeResponse = await axios.get(`${BASE_URL}/random/anime`);
    const randomAnime = randomAnimeResponse.data.data;

    let synopsis = randomAnime.synopsis;
    const title = randomAnime.title;
    const image = randomAnime.images?.jpg?.image_url;

    // Remove title from synopsis if it exists
    if (synopsis && title) {
      synopsis = synopsis.replace(new RegExp(title, 'gi'), '***');
    }

    return { title, synopsis, image };
  } catch (error) {
    console.error('Error fetching anime data:', error);
    throw new Error('Failed to fetch anime data');
  }
}

// Fetch random anime titles as wrong answers (distractors)
export async function fetchRandomAnimeTitles(count = 2) {
  try {
    const response = await axios.get(`${BASE_URL}/top/anime`);
    const topAnimes = response.data.data.slice(0, count);

    const titles = topAnimes.map((anime) => anime.title);
    return titles;
  } catch (error) {
    console.error('Error fetching random anime titles:', error);
    throw new Error('Failed to fetch random anime titles');
  }
}
