import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

// Pre-prepared fallback list of character names for wrong answers
const fallbackCharacters = [
  "Naruto Uzumaki", "Monkey D. Luffy", "Goku", "Light Yagami", "Lelouch Lamperouge",
  "Eren Yeager", "Levi Ackerman", "Mikasa Ackerman", "Edward Elric", "Spike Spiegel",
  "Gintoki Sakata", "Saitama", "Killua Zoldyck", "L Lawliet", "Vegeta",
  "Itachi Uchiha", "Kakashi Hatake", "Sakura Haruno", "Sailor Moon", "Gon Freecss",
  "Tanjiro Kamado", "Nezuko Kamado", "Zoro Roronoa", "Sanji", "Shinobu Kocho", 
  "Todoroki Shoto", "Bakugo Katsuki", "Deku", "Rukia Kuchiki", "Ichigo Kurosaki",
  "Natsu Dragneel", "Erza Scarlet", "Gray Fullbuster", "Lucy Heartfilia", 
  "Tsunade", "Jiraiya", "Obito Uchiha", "Madara Uchiha", "Shikamaru Nara", 
  "Hinata Hyuga", "Boruto Uzumaki", "Sarada Uchiha", "Shinra Kusakabe"
];

// Function to replace the character's name in the description with "this character"
function replaceCharacterName(description, characterName) {
  if (!description || !characterName) {
    console.error("Invalid description or character name to replace.");
    return description || "No description available";
  }
  
  const regex = new RegExp(characterName, 'gi'); // Case-insensitive replacement
  return description.replace(regex, 'this character');
}

// Fetch valid character data from the Jikan API with fallback logic
async function fetchValidCharacterData(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(`${BASE_URL}/random/characters`);
      const character = response.data.data;

      // Log the API response for debugging
      console.log("Fetched character data:", character);

      if (character.name && character.about && character.images?.jpg?.image_url) {
        const characterName = character.name;
        let description = replaceCharacterName(character.about, characterName);
        const image = character.images.jpg.image_url;

        return { characterName, description, image };
      } else {
        console.error("Incomplete character data. Trying again...");
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
    }
  }
  throw new Error('Failed to fetch valid character data after multiple attempts');
}

export async function fetchCharacterData() {
  return await fetchValidCharacterData();
}

// Fetch a random wrong answer from the fallback character list
export function fetchRandomWrongAnswer() {
  const randomIndex = Math.floor(Math.random() * fallbackCharacters.length);
  return fallbackCharacters[randomIndex];
}
