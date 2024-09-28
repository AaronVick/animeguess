import axios from 'axios';

export const fetchAnimeData = async () => {
  try {
    const response = await axios.get('https://api.jikan.moe/v4/random/anime');
    const anime = response.data.data;
    
    return {
      title: anime.title || 'Unknown',
      synopsis: anime.synopsis || 'No synopsis available',
      image: anime.images?.jpg?.image_url || '', // Handle if image is missing
    };
  } catch (error) {
    console.error('Error fetching anime data:', error);
    throw new Error('Failed to fetch anime data');
  }
};
