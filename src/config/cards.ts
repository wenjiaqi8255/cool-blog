/**
 * Card Configuration Types
 */
export type CardType = 'image' | 'text' | 'terminal' | 'stats';
export type CardVariant = 'light' | 'dark';
export type CardSpan = 1 | 2 | 4;

export interface CardConfig {
  id: string;
  type: CardType;
  span: CardSpan;
  row?: 2; // Optional row span
  variant?: CardVariant;
  props: Record<string, unknown>;
}

/**
 * Portfolio Cards Configuration
 * 12 cards matching the design mockup
 */
export const portfolioCards: CardConfig[] = [
  // Row 1: Featured project (large) + Stats
  {
    id: 'featured-ml-project',
    type: 'image',
    span: 2,
    row: 2,
    variant: 'dark',
    props: {
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      title: 'Machine Learning Pipeline',
      subtitle: 'Production-grade ML infrastructure',
      link: '/projects/ml-pipeline'
    }
  },
  {
    id: 'weekly-commits',
    type: 'stats',
    span: 1,
    props: {
      repo: 'vercel/next.js', // Using a popular repo for demo
      label: 'Weekly Commits'
    }
  },
  {
    id: 'about-text',
    type: 'text',
    span: 1,
    variant: 'light',
    props: {
      title: 'Computing as Craft',
      body: 'Building systems that matter. Focused on machine learning, distributed systems, and elegant code architecture.',
      link: '/about'
    }
  },

  // Row 2: Image cards + Terminal
  {
    id: 'project-data-viz',
    type: 'image',
    span: 1,
    variant: 'light',
    props: {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      title: 'Data Visualization',
      subtitle: 'Interactive dashboards',
      link: '/projects/data-viz'
    }
  },
  {
    id: 'terminal-setup',
    type: 'terminal',
    span: 2,
    props: {
      title: 'Development Setup',
      commands: [
        'brew install neovim',
        'git config --global init.defaultBranch main',
        'npm install -g pnpm'
      ],
      link: '/setup'
    }
  },
  {
    id: 'project-api',
    type: 'image',
    span: 1,
    variant: 'light',
    props: {
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
      title: 'API Architecture',
      subtitle: 'Scalable backend systems',
      link: '/projects/api'
    }
  },

  // Row 3: Text cards
  {
    id: 'writing-philosophy',
    type: 'text',
    span: 2,
    variant: 'dark',
    props: {
      title: 'Technical Writing',
      body: 'Deep dives into systems engineering, machine learning internals, and the craft of building robust software.',
      link: '/articles'
    }
  },
  {
    id: 'project-mobile',
    type: 'image',
    span: 1,
    variant: 'light',
    props: {
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
      title: 'Mobile Development',
      subtitle: 'Cross-platform apps',
      link: '/projects/mobile'
    }
  },
  {
    id: 'stats-code',
    type: 'text',
    span: 1,
    variant: 'light',
    props: {
      title: 'Open Source',
      body: 'Contributing to the community. Active maintainer of several CLI tools and libraries.',
      link: '/opensource'
    }
  },

  // Row 4: Newsletter + Projects
  {
    id: 'newsletter-cta',
    type: 'text',
    span: 2,
    variant: 'dark',
    props: {
      title: 'Stay Updated',
      body: 'Subscribe to the newsletter for weekly insights on ML, systems engineering, and software craftsmanship.',
      link: '#subscribe'
    }
  },
  {
    id: 'project-cli',
    type: 'image',
    span: 1,
    variant: 'light',
    props: {
      image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80',
      title: 'CLI Tools',
      subtitle: 'Developer productivity',
      link: '/projects/cli'
    }
  },
  {
    id: 'project-research',
    type: 'image',
    span: 1,
    variant: 'light',
    props: {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      title: 'Research',
      subtitle: 'Academic collaborations',
      link: '/projects/research'
    }
  }
];
