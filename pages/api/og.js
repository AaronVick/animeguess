import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const description = searchParams.get('description');
  const image = searchParams.get('image');
  const message = searchParams.get('message');

  const placeholderImage = 'https://via.placeholder.com/400x600?text=No+Image+Available';

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
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '20px' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Guess the Anime Character</h1>
            <p style={{ fontSize: message ? '34px' : '24px', lineHeight: '1.4' }}>{description || message || 'Guess the anime character based on the description'}</p>
          </div>
          {image && (
            <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={image} 
                alt="Character" 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
              />
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