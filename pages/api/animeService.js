import axios from 'axios';

// Jikan API base URL
const BASE_URL = 'https://api.jikan.moe/v4';

// Function to fetch random anime data (title, synopsis, image) and scrub the title from the synopsis
export async function fetchAnimeData() {
  try {
    // Fetch random anime from the API
    const randomAnimeResponse = await axios.get(`${BASE_URL}/random/anime`);
    const randomAnime = randomAnimeResponse.data.data;
    
    // Scrub the title from the synopsis
    const synopsis = randomAnime.synopsis.replace(new RegExp(randomAnime.title, 'gi'), '[REDACTED]');
    const title = randomAnime.title;
    const image = randomAnime.images?.jpg?.image_url || '';

    // Return the necessary data for game
    return { title, synopsis, image };
  } catch (error) {
    console.error('Error fetching anime data:', error);
    throw new Error('Failed to fetch anime data');
  }
}

// Function to fetch random anime titles for incorrect answers (distractors)
export async function fetchRandomAnimeTitles(count = 2) {
  try {
    // Fetch a list of top anime as distractors
    const response = await axios.get(`${BASE_URL}/top/anime`);
    const topAnimes = response.data.data.slice(0, count); // Fetch top 'count' animes
    
    // Extract the titles to be used as wrong answers
    const titles = topAnimes.map((anime) => anime.title);
    return titles;
  } catch (error) {
    console.error('Error fetching random anime titles:', error);
    throw new Error('Failed to fetch random anime titles');
  }
}

// Function to fetch random anime characters (to use as clues)
export async function fetchAnimeCharacterById(animeId) {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${animeId}/characters`);
    const characters = response.data.data.map(character => character.character.name);
    
    return characters.length > 0 ? characters[0] : null; // Return the first character name
  } catch (error) {
    console.error('Error fetching anime characters:', error);
    throw new Error('Failed to fetch anime characters');
  }
}

// Function to fetch genres/themes (optional usage)
export async function fetchAnimeGenresOrThemes(animeId) {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${animeId}`);
    const genres = response.data.data.genres.map(genre => genre.name);
    const themes = response.data.data.themes.map(theme => theme.name);
    
    return { genres, themes };
  } catch (error) {
    console.error('Error fetching genres/themes:', error);
    throw new Error('Failed to fetch genres/themes');
  }
}
