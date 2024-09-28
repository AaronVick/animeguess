import axios from 'axios';

export async function fetchAnimeData() {
  try {
    const animeId = Math.floor(Math.random() * 10000); // Randomly selects an anime
    const animeResponse = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`);
    const animeData = animeResponse.data.data;

    return {
      title: animeData.title,
      synopsis: animeData.synopsis,
      image: animeData.images.jpg.image_url,
    };
  } catch (error) {
    console.error("Error fetching anime data:", error);
    throw new Error('Unable to fetch anime data at this time.');
  }
}
