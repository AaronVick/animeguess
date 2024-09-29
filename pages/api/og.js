export default async function handler(req, res) {
  const { characterName, description, image } = req.query;

  try {
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
              width: 70%;
            }
            .image {
              width: 30%;
              display: flex;
              align-items: center;
            }
            img {
              max-width: 100%;
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

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error generating OG image:', error);
    res.status(500).send('Error generating OG image');
  }
}
