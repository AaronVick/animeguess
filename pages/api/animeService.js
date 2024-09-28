import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

function removeTitleFromSynopsis(synopsis, title) {
  const regex = new RegExp(title, 'gi');
  return synopsis.replace(regex, '[REDACTED]');
}

async function fetchValidAnimeData(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(`${BASE_URL}/random/anime`);
      const anime = response.data.data;
      
      if (anime.title && anime.synopsis && anime.images?.jpg?.image_url) {
        const title = anime.title;
        let synopsis = removeTitleFromSynopsis(anime.synopsis, title);
        const image = anime.images.jpg.image_url;
        
        return { title, synopsis, image };
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
    }
  }
  throw new Error('Failed to fetch valid anime data after multiple attempts');
}

export async function fetchAnimeData() {
  return await fetchValidAnimeData();
}

export async function fetchRandomAnimeTitles(count = 1) {
  try {
    const response = await axios.get(`${BASE_URL}/top/anime`);
    const topAnimes = response.data.data.slice(0, count);
    return topAnimes.map((anime) => anime.title);
  } catch (error) {
    console.error('Error fetching random anime titles:', error);
    throw new Error('Failed to fetch random anime titles');
  }
}