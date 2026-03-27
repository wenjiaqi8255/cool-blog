import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import TextCard from '../../../components/cards/TextCard.astro';

describe('TextCard', () => {
  it('renders with title', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TextCard, {
      props: { title: 'Test Title' }
    });

    expect(result).toContain('Test Title');
  });

  it('renders with body text', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TextCard, {
      props: {
        title: 'Title',
        body: 'Description text here'
      }
    });

    expect(result).toContain('Description text here');
  });

  it('applies light variant by default', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TextCard, {
      props: { title: 'Test' }
    });

    expect(result).toContain('text-card');
  });

  it('applies dark variant when specified', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TextCard, {
      props: {
        title: 'Test',
        variant: 'dark'
      }
    });

    expect(result).toContain('dark');
  });

  it('includes arrow icon', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TextCard, {
      props: { title: 'Test' }
    });

    expect(result).toContain('↗');
  });
});
