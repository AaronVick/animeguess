import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

// Function to clean up unnecessary parts of the description
function cleanDescription(description) {
  // Define patterns to remove
  const unwantedPatterns = [
    /No voice actors.*?database by searching.*?\./gi,  // Matches 'No voice actors' and 'Help improve'
    /Help improve our database.*?\./gi,  // Matches 'Help improve our database'
    /No description available\./gi,       // Matches 'No description available'
    /^Appears in episode.*?\./gi          // Matches descriptions starting with 'Appears in episode'
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

// Fallback characters for wrong answers and last-resort character
const fallbackCharacters = [
  "Naruto Uzumaki", "Monkey D. Luffy", "Goku", "Light Yagami", "Lelouch Lamperouge",
  "Eren Yeager", "Levi Ackerman", "Mikasa Ackerman", "Edward Elric", "Spike Spiegel",
  "Gintoki Sakata", "Saitama", "Killua Zoldyck", "L Lawliet", "Vegeta",
  "Itachi Uchiha", "Kakashi Hatake", "Sakura Haruno", "Sailor Moon", "Gon Freecss",
  "Ichigo Kurosaki", "Natsu Dragneel", "Yusuke Urameshi", "Kirito", "Asuna Yuuki",
  "Shinichi Kudo", "Ran Mouri", "Roronoa Zoro", "Sanji", "Bulma"
];

const fallbackCharacterData = {
  characterName: 'Saitama',
  description: 'Saitama is the strongest hero in the world, but he struggles with boredom as he can defeat any opponent with a single punch.',
  image: 'https://cdn.myanimelist.net/images/characters/14/311621.jpg'
};

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

// Fetch valid character data with improved retries and fallback
async function fetchValidCharacterData(maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(`${BASE_URL}/random/characters`);
      const character = response.data.data;

      const characterName = character.name;
      let description = character.about;
      const image = character.images?.jpg?.image_url;

      // Ensure the description exists, is clean, and does not start with 'Appears in episode'
      if (description && description.trim() !== '' && description !== 'No description available.' &&
          !description.toLowerCase().startsWith('appears in episode') && 
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
    }
  }
  
  // Fallback to predefined character if all retries fail
  console.warn('Using fallback character due to multiple failures');
  return fallbackCharacterData;
}

export async function fetchCharacterData() {
  return await fetchValidCharacterData();
}
