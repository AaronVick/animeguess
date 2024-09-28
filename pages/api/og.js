import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const synopsis = searchParams.get('synopsis');
  const image = searchParams.get('image');
  const message = searchParams.get('message');

  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#1E1E1E',
            color: '#FFFFFF',
            width: '100%',
            height: '100%',
            padding: '20px',
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>{message || 'Anime Guess Game'}</h1>
            <p style={{ fontSize: '24px' }}>{synopsis || 'Guess the anime based on the description'}</p>
          </div>
          {image && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '300px' }}>
              <img src={image} alt="Anime" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new ImageResponse(
      (
        <div style={{ display: 'flex', backgroundColor: '#FF0000', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <h1>Error Generating Image</h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
