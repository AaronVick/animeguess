export default async function handler(req, res) {
  const { title, synopsis, image } = req.query;

  const message = synopsis
    ? synopsis.replace(new RegExp(title, 'gi'), '[REDACTED]')
    : '[REDACTED] Synopsis not available';

  const imageUrl = image || 'default-image-url'; // Placeholder for anime without images

  try {
    const html = `
    <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #1e1e1e;
            color: #fff;
          }
          .container {
            max-width: 800px;
            padding: 20px;
            background-color: #1e1e1e;
            border-radius: 10px;
          }
          h1 {
            font-size: 40px;
            margin: 0;
          }
          p {
            font-size: 18px;
            color: #ccc;
          }
          .image {
            max-width: 150px;
            max-height: 150px;
            object-fit: cover;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${message}</h1>
          <p>${message}</p>
          <img class="image" src="${imageUrl}" alt="anime image" />
        </div>
      </body>
    </html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error generating OG image:', error);
    res.status(500).send('Internal Server Error');
  }
}
