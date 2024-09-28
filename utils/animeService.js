export async function fetchAnime() {
    try {
      const response = await fetch('https://api.jikan.moe/v3/anime/1');
      const data = await response.json();
      
      const correctAnime = data.title;
      const description = data.synopsis;
      const imageUrl = data.image_url;
  
      // Generate a wrong guess (you can customize this logic)
      const anotherResponse = await fetch('https://api.jikan.moe/v3/anime/2');
      const anotherData = await anotherResponse.json();
      const wrongAnime = anotherData.title;
  
      return { correctAnime, description, imageUrl, wrongAnime };
    } catch (error) {
      console.error('Error fetching anime data:', error);
      throw new Error('Unable to fetch anime data');
    }
  }
  