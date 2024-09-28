import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title');
  const synopsis = searchParams.get('synopsis');
  const image = searchParams.get('image');
  const message = searchParams.get('message');

  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex', // Add display: flex to handle multiple child nodes properly
            flexDirection: 'row',
            backgroundColor: '#1E1E1E',
            color: '#FFFFFF',
            width: '100%',
            height: '100%',
            padding: '20px',
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>{title || message || 'Anime Game'}</h1>
            <p style={{ fontSize: '24px' }}>{synopsis || 'Guess the anime title from the description'}</p>
          </div>
          {image && <img src={image} alt="Anime" style={{ width: '200px', height: '300px' }} />}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return new ImageResponse(
      (
        <div style={{ backgroundColor: '#FF0000', width: '100%', height: '100%' }}>
          <h1>Error</h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
