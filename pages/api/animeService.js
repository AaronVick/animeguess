import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

// Function to clean up unnecessary parts of the description
function cleanDescription(description) {
  const unwantedPatterns = [
    /No voice actors.*?database by searching.*?\./gi,
    /Help improve our database.*?\./gi,
    /No description available\./gi,
    /^Appears in episode.*?\./gi
  ];

  let cleanedDescription = description;
  unwantedPatterns.forEach((pattern) => {
    cleanedDescription = cleanedDescription.replace(pattern, '');
  });

  return cleanedDescription.trim();
}

// Check if the character's name is in the description
function isNameInDescription(name, description) {
  const nameParts = name.toLowerCase().split(' ');
  const descriptionLower = description.toLowerCase();
  return nameParts.some(part => descriptionLower.includes(part));
}

// Fallback incorrect character names (used only for incorrect answers)
const fallbackIncorrectNames = [
  "Naruto Uzumaki", "Monkey D. Luffy", "Goku", "Light Yagami", "Lelouch Lamperouge",
  "Eren Yeager", "Levi Ackerman", "Mikasa Ackerman", "Edward Elric", "Spike Spiegel",
  "Gintoki Sakata", "Saitama", "Killua Zoldyck", "L Lawliet", "Vegeta",
  "Itachi Uchiha", "Kakashi Hatake", "Sakura Haruno", "Sailor Moon", "Gon Freecss",
  "Ichigo Kurosaki", "Natsu Dragneel", "Yusuke Urameshi", "Kirito", "Asuna Yuuki",
  "Shinichi Kudo", "Ran Mouri", "Roronoa Zoro", "Sanji", "Bulma"
];

// Fetch random character names for wrong answers
export async function fetchRandomCharacterNames(count = 1, excludeName = '') {
  try {
    const response = await axios.get(`${BASE_URL}/top/characters`, { params: { limit: 100 } });
    const characters = response.data.data;
    const filteredCharacters = characters.filter(char => char.name !== excludeName);

    // Shuffle the array
    for (let i = filteredCharacters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredCharacters[i], filteredCharacters[j]] = [filteredCharacters[j], filteredCharacters[i]];
    }

    return filteredCharacters.slice(0, count).map(character => character.name);
  } catch (error) {
    console.error('Error fetching random character names:', error.message);
    console.log('Using fallback character names');
    
    // Use fallback incorrect names if the API fails
    const filteredFallbacks = fallbackIncorrectNames.filter(name => name !== excludeName);
    return filteredFallbacks.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}

// Fetch valid character data with retries
async function fetchValidCharacterData(maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(`${BASE_URL}/random/characters`);
      const character = response.data.data;

      if (!character || !character.name || !character.about || !character.images?.jpg?.image_url) {
        throw new Error('Invalid character data');
      }

      const characterName = character.name;
      let description = cleanDescription(character.about);
      const image = character.images.jpg.image_url;

      // Ensure the description is valid and does not include the character's name
      if (!isNameInDescription(characterName, description)) {
        description = removeCharacterName(description, characterName);

        // Trim long descriptions
        if (description.length > 150) {
          description = description.substring(0, 147) + '...';
        }

        console.log('Fetched valid character data:', { characterName, description, image });
        return { characterName, description, image };
      }

      console.log('Skipping character due to invalid description, retrying...');
    } catch (error) {
      console.error('Error fetching character data:', error.message);
    }
  }

  throw new Error('Failed to fetch valid character data after multiple attempts');
}

// Exported function to fetch character data for the game
export async function fetchCharacterData() {
  return await fetchValidCharacterData();
}
