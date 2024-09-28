import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('imageUrl');
    const message = searchParams.get('message');

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1E1E1E',
            color: '#FFFFFF',
          }}
        >
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '20px' }}>
            Anime Guessing Game
          </div>
          <div style={{ fontSize: '32px', textAlign: 'center', maxWidth: '80%', wordWrap: 'break-word' }}>
            {imageUrl ? (
              <img src={imageUrl} alt="Anime Image" style={{ width: '200px', height: 'auto' }} />
            ) : message ? message : 'Welcome to the Anime Guessing Game!'}
          </div>
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
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1E1E1E',
            color: '#FFFFFF',
          }}
        >
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#FF0000', marginBottom: '20px' }}>
            Error
          </div>
          <div style={{ fontSize: '32px', textAlign: 'center', maxWidth: '80%', wordWrap: 'break-word' }}>
            An error occurred while generating the image. Please try again.
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
