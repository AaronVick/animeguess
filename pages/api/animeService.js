import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

export async function fetchCharacterData() {
  try {
    const response = await axios.get(`${BASE_URL}/random/characters`);
    const character = response.data.data;

    const characterName = character.name;
    const description = character.about || 'No description available.';
    const image = character.images?.jpg?.image_url;

    console.log('Fetched character data:', { characterName, description, image });

    return { characterName, description, image };
  } catch (error) {
    console.error('Error fetching character data:', error);
    throw new Error('Failed to fetch character data');
  }
}

export async function fetchRandomCharacterNames(count = 1) {
  try {
    const response = await axios.get(`${BASE_URL}/top/characters`);
    const topCharacters = response.data.data.slice(0, count);
    return topCharacters.map((character) => character.name);
  } catch (error) {
    console.error('Error fetching random character names:', error);
    throw new Error('Failed to fetch random character names');
  }
}
