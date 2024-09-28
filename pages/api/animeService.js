import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

// Utility function to remove the title from the character's description
function removeCharacterNameFromDescription(description, characterName) {
  const regex = new RegExp(characterName, 'gi'); // case-insensitive
  return description.replace(regex, '[REDACTED]');
}

// Fetch random anime character data
async function fetchValidCharacterData(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(`${BASE_URL}/random/characters`);
      const character = response.data.data;
      
      if (character.name && character.about && character.images?.jpg?.image_url) {
        const characterName = character.name;
        let description = removeCharacterNameFromDescription(character.about, characterName);
        const image = character.images.jpg.image_url;

        return { characterName, description, image };
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
    }
  }
  throw new Error('Failed to fetch valid character data after multiple attempts');
}

// Exported function to fetch random character data
export async function fetchCharacterData() {
  return await fetchValidCharacterData();
}

// Fetch random anime titles for wrong answers
export async function fetchRandomAnimeTitles(count = 1) {
  try {
    const response = await axios.get(`${BASE_URL}/top/characters`);
    const topCharacters = response.data.data.slice(0, count);
    return topCharacters.map((character) => character.name);
  } catch (error) {
    console.error('Error fetching random character names:', error);
    throw new Error('Failed to fetch random character names');
  }
}
