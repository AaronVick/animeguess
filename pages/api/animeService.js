import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

function isNameInDescription(name, description) {
  const nameParts = name.toLowerCase().split(' ');
  const descriptionLower = description.toLowerCase();
  return nameParts.some(part => descriptionLower.includes(part));
}

async function fetchValidCharacterData(maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(`${BASE_URL}/random/characters`);
      const character = response.data.data;

      const characterName = character.name;
      const description = character.about;
      const image = character.images?.jpg?.image_url;

      if (description && 
          description.trim() !== '' && 
          description !== 'No description available.' &&
          !isNameInDescription(characterName, description)) {
        console.log('Fetched valid character data:', { characterName, description: description.substring(0, 50) + '...', image });
        return { characterName, description, image };
      }
      console.log('Skipping character due to invalid description or name in description, retrying...');
    } catch (error) {
      console.error('Error fetching character data:', error);
      if (i === maxRetries - 1) throw new Error('Failed to fetch character data after multiple attempts');
    }
  }
  throw new Error('Failed to fetch a character with a valid description');
}

export async function fetchCharacterData() {
  return await fetchValidCharacterData();
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