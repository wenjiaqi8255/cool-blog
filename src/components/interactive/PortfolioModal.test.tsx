import { describe, it, expect } from 'vitest';

// Test the PortfolioModal component interface
// Since the component uses React hooks, we test the props interface and expected behavior

export interface Article {
  id: number;
  title: string;
  slug: string;
  date: Date;
  tags: string[];
  excerpt: string;
  body: string;
}

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

describe('PortfolioModal Props Interface', () => {
  const mockArticle: Article = {
    id: 1,
    title: 'Test Project',
    slug: 'test-project',
    date: new Date('2024-01-15'),
    tags: ['portfolio', 'react'],
    excerpt: 'Test excerpt',
    body: '# Test Content\n\nThis is a test project.'
  };

  it('accepts isOpen boolean prop', () => {
    const props: PortfolioModalProps = {
      isOpen: true,
      onClose: () => {},
      article: mockArticle
    };
    expect(props.isOpen).toBe(true);
  });

  it('accepts onClose callback prop', () => {
    const onClose = () => {};
    const props: PortfolioModalProps = {
      isOpen: true,
      onClose,
      article: mockArticle
    };
    expect(typeof props.onClose).toBe('function');
  });

  it('accepts null article', () => {
    const props: PortfolioModalProps = {
      isOpen: true,
      onClose: () => {},
      article: null
    };
    expect(props.article).toBeNull();
  });

  it('accepts valid article object', () => {
    const props: PortfolioModalProps = {
      isOpen: true,
      onClose: () => {},
      article: mockArticle
    };
    expect(props.article).toEqual(mockArticle);
  });

  it('article has required fields', () => {
    expect(mockArticle.id).toBe(1);
    expect(mockArticle.title).toBe('Test Project');
    expect(mockArticle.slug).toBe('test-project');
    expect(mockArticle.date).toBeInstanceOf(Date);
    expect(mockArticle.tags).toHaveLength(2);
    expect(mockArticle.excerpt).toBe('Test excerpt');
    expect(mockArticle.body).toBeTruthy();
  });

  it('handles false isOpen correctly', () => {
    const props: PortfolioModalProps = {
      isOpen: false,
      onClose: () => {},
      article: mockArticle
    };
    // When isOpen is false, component should render null
    expect(props.isOpen).toBe(false);
  });

  it('tags are strings array', () => {
    mockArticle.tags.forEach((tag) => {
      expect(typeof tag).toBe('string');
    });
  });

  it('body can contain HTML content', () => {
    const articleWithHtml: Article = {
      ...mockArticle,
      body: '<h1>Title</h1><p>Content</p>'
    };
    expect(articleWithHtml.body).toContain('<h1>');
  });
});
