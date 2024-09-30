import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

// Function to clean up unnecessary parts of the description
function cleanDescription(description) {
  // Define patterns to remove
  const unwantedPatterns = [
    /No voice actors.*?database by searching.*?\./gi,  // Matches 'No voice actors' and 'Help improve'
    /Help improve our database.*?\./gi,  // Matches 'Help improve our database'
    /No description available\./gi       // Matches 'No description available'
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

// Remove the character's name from the description, replacing it with "this character"
function removeCharacterName(description, name) {
  const regex = new RegExp(name, 'gi');
  return description.replace(regex, 'this character');
}

// Fetch valid character data
async function fetchValidCharacterData(maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(`${BASE_URL}/random/characters`);
      const character = response.data.data;

      const characterName = character.name;
      let description = character.about;
      const image = character.images?.jpg?.image_url;

      if (description && 
          description.trim() !== '' && 
          description !== 'No description available.' &&
          !isNameInDescription(characterName, description)) {
        
        // Clean up the description by removing unnecessary text
        description = cleanDescription(description);

        // Remove the character's name from the description
        description = removeCharacterName(description, characterName);

        // Limit description length to approximately 3 lines (assuming 50 characters per line)
        if (description.length > 150) {
          description = description.substring(0, 147) + '...';
        }

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

// A more extensive fallback character list
const fallbackCharacters = [
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
    const response = await axios.get(`${BASE_URL}/top/characters`, {
      params: {
        limit: 100
      }
    });
    const characters = response.data.data;
    const filteredCharacters = characters.filter(char => char.name !== excludeName);
    
    // Shuffle the array
    for (let i = filteredCharacters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredCharacters[i], filteredCharacters[j]] = [filteredCharacters[j], filteredCharacters[i]];
    }
    
    return filteredCharacters.slice(0, count).map(character => character.name);
  } catch (error) {
    console.error('Error fetching random character names:', error);
    console.log('Using fallback character names');
    
    // Use fallback characters if API fails
    const filteredFallbacks = fallbackCharacters.filter(name => name !== excludeName);
    return filteredFallbacks.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}
