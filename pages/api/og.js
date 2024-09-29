export default async function handler(req, res) {
  const { characterName, description, image } = req.query;

  try {
    // HTML response to create the OG image for Vercel
    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: space-between;
              background-color: #1c1c1e;
              color: white;
              padding: 20px;
            }
            .info {
              width: 50%; /* Reduce width to allow more room for the image */
            }
            .image {
              width: 50%; /* Increase the width to make the image take more space */
              display: flex;
              align-items: center;
              justify-content: center; /* Center the image */
            }
            img {
              max-width: 90%; /* Make the image take up more space but leave some padding */
              max-height: 90vh; /* Ensure the image doesn’t overflow the screen vertically */
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="info">
            <h1>${characterName}</h1>
            <p>${description}</p>
          </div>
          <div class="image">
            <img src="${image}" alt="Character image" />
          </div>
        </body>
      </html>
    `;

    // Set the appropriate headers
    res.setHeader('Content-Type', 'text/html');
    // Send the HTML response to generate the Open Graph image
    res.status(200).send(html);
  } catch (error) {
    // Handle any errors
    console.error('Error generating OG image:', error);
    res.status(500).send('Error generating OG image');
  }
}
