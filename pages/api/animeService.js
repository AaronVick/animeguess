import axios from 'axios';

// Function to fetch random anime data from Jikan API
export async function fetchAnimeData() {
  const randomAnimeId = Math.floor(Math.random() * 1000) + 1; // Random ID for anime
  const response = await axios.get(`https://api.jikan.moe/v4/anime/${randomAnimeId}`);

  if (response.data && response.data.data) {
    const anime = response.data.data;
    const title = anime.title;
    const imageUrl = anime.images.jpg.image_url;
    return { title, imageUrl };
  } else {
    throw new Error('Failed to fetch anime data.');
  }
}
