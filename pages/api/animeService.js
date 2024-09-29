import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

// Function to fetch a random anime character
export async function fetchCharacterData() {
  try {
    const response = await axios.get(`${BASE_URL}/random/characters`);
    const character = response.data.data;
    
    // Fetch the character's name, description, and image
    const characterName = character.name;
    const description = character.about;
    const image = character.images.jpg.image_url;
    
    return { characterName, description, image };
  } catch (error) {
    console.error('Error fetching character data:', error);
    throw new Error('Failed to fetch character data');
  }
}

// Function to fetch random character names for wrong answers
export async function fetchRandomCharacterNames(count = 1) {
  try {
    const response = await axios.get(`${BASE_URL}/characters`);
    const randomCharacters = response.data.data.slice(0, count);
    
    return randomCharacters.map(character => character.name);
  } catch (error) {
    console.error('Error fetching random character names:', error);
    throw new Error('Failed to fetch random character names');
  }
}
