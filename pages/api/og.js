import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const description = searchParams.get('description');
    const image = searchParams.get('image');

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            backgroundColor: '#f0f0f0',
            color: '#000',
          }}
        >
          {image && (
            <img
              src={image}
              alt="Anime"
              style={{ width: '50%', height: '100%', objectFit: 'cover' }}
            />
          )}
          <div style={{ padding: '20px', fontSize: '32px', display: 'flex', alignItems: 'center' }}>
            {description || 'Guess the Anime!'}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new ImageResponse(<div>Error generating the image</div>, {
      width: 1200,
      height: 630,
    });
  }
}
