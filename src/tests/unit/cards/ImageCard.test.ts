import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ImageCard from '../../../components/cards/ImageCard.astro';

describe('ImageCard', () => {
  it('renders with title and image', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ImageCard, {
      props: {
        image: 'https://example.com/image.jpg',
        title: 'Test Project'
      }
    });

    expect(result).toContain('Test Project');
    expect(result).toContain('https://example.com/image.jpg');
  });

  it('renders image with image-wrapper class for grayscale effect', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ImageCard, {
      props: {
        image: 'https://example.com/image.jpg',
        title: 'Test'
      }
    });

    expect(result).toContain('image-wrapper');
    expect(result).toContain('<img');
  });

  it('applies dark variant class', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ImageCard, {
      props: {
        image: 'https://example.com/image.jpg',
        title: 'Test',
        variant: 'dark'
      }
    });

    expect(result).toContain('dark');
  });
});
