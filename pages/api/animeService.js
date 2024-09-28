import axios from 'axios';

// Jikan API base URL
const BASE_URL = 'https://api.jikan.moe/v4';

// Utility function to remove the title from the synopsis
function removeTitleFromSynopsis(synopsis, title) {
  const regex = new RegExp(title, 'gi'); // case-insensitive
  return synopsis.replace(regex, '[REDACTED]');
}

// Fetch a random anime's title and description from the Jikan API
export async function fetchAnimeData() {
  try {
    // Fetch random anime from the API
    const randomAnimeResponse = await axios.get(`${BASE_URL}/random/anime`);
    const randomAnime = randomAnimeResponse.data.data;
    
    const title = randomAnime.title;
    let synopsis = randomAnime.synopsis;
    const image = randomAnime.images?.jpg?.image_url; // Use the image URL from the API

    // Scrub the title from the synopsis to prevent giving away the answer
    if (synopsis && title) {
      synopsis = removeTitleFromSynopsis(synopsis, title);
    }

    // Return the necessary data
    return { title, synopsis, image };
  } catch (error) {
    console.error('Error fetching anime data:', error);
    throw new Error('Failed to fetch anime data');
  }
}

// Fetch random anime titles as wrong answers (distractors)
export async function fetchRandomAnimeTitles(count = 3) {
  try {
    const response = await axios.get(`${BASE_URL}/top/anime`);
    const topAnimes = response.data.data.slice(0, count); // Get the top 'count' animes
    
    const titles = topAnimes.map((anime) => anime.title);
    return titles;
  } catch (error) {
    console.error('Error fetching random anime titles:', error);
    throw new Error('Failed to fetch random anime titles');
  }
}
