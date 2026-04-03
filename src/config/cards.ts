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
 * Matching the design mockup layout
 */
export const portfolioCards: CardConfig[] = [
  // Row 1: Manifesto (span-2) + Featured Setup image (span-2)
  {
    id: 'manifesto',
    type: 'text',
    span: 2,
    variant: 'light',
    props: {
      metaTag: 'Manifesto',
      title: 'COMPUTING AS CRAFT.',
      body: 'Exploring the intersection of generative intelligence, low-level systems engineering, and the aesthetics of the command line interface.',
      link: '#',
      isLarge: true
    }
  },
  {
    id: 'featured-setup',
    type: 'image',
    span: 2,
    variant: 'light',
    props: {
      image: 'https://images.unsplash.com/photo-1496559249665-c7e2874707ea?q=80&w=2574&auto=format&fit=crop',
      title: 'THE MONOCHROME WORKFLOW',
      metaTag: 'Featured Setup',
      link: '#'
    }
  },

  // Row 2: Transformer Latency + Ricing Arch Linux (dark)
  {
    id: 'transformer-latency',
    type: 'terminal',
    span: 1,
    variant: 'light',
    props: {
      metaTag: 'Artificial Intelligence',
      title: 'Transformer Latency',
      commands: ['python verify_model.py', '> Inference: 42ms', '> Accuracy: 98.4%'],
      link: '#'
    }
  },
  {
    id: 'ricing-arch',
    type: 'terminal',
    span: 1,
    variant: 'dark',
    props: {
      metaTag: 'Unixporn',
      title: 'Ricing Arch Linux',
      body: 'A deep dive into tiling window managers, polybar configuration, and creating the perfect distraction-free environment.',
      commands: ['pacman -S bspwm sxhkd'],
      link: '#'
    }
  },

  // Row 3: Visitor Count (stats) + Rust vs C++ + Code image (span-2)
  // Note: Visitor count is injected dynamically in index.astro
  // This is a placeholder that gets replaced at runtime
  {
    id: 'visitor-stats',
    type: 'stats',
    span: 1,
    props: {
      label: 'Blog Traffic',
      title: 'Visitor Count',
      value: '---' // Placeholder - replaced dynamically
    }
  },
  {
    id: 'rust-vs-cpp',
    type: 'text',
    span: 1,
    variant: 'light',
    props: {
      metaTag: 'Engineering',
      title: 'Rust vs C++',
      body: 'Memory safety without garbage collection. Why the industry is shifting its backend philosophy.',
      link: '#'
    }
  },
  {
    id: 'source-code',
    type: 'image',
    span: 2,
    variant: 'light',
    props: {
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
      metaTag: 'Source Code',
      link: '#'
    }
  },

  // Row 4: ZSH Plugins + Self-Hosting LLMs + Ghost in Shell (dark, row-2)
  {
    id: 'zsh-plugins',
    type: 'text',
    span: 1,
    variant: 'light',
    props: {
      metaTag: 'Terminal',
      title: 'ZSH Plugins',
      body: 'Optimizing shell productivity with autosuggestions and syntax highlighting.',
      link: '#'
    }
  },
  {
    id: 'self-hosting-llms',
    type: 'text',
    span: 1,
    variant: 'light',
    props: {
      metaTag: 'Homelab',
      title: 'Self-Hosting LLMs',
      body: 'Running Llama 3 on consumer hardware via Docker containers.',
      link: '#'
    }
  },
  {
    id: 'ghost-in-shell',
    type: 'text',
    span: 1,
    row: 2,
    variant: 'dark',
    props: {
      metaTag: 'Philosophy',
      title: 'THE GHOST IN THE SHELL',
      body: 'Are we building tools that help us think, or tools that replace thought? An analysis of copilot-driven development.',
      link: '#',
      isLarge: true,
      showIcon: true
    }
  },

  // Row 5: Vim Motions (span-2) + Newsletter
  {
    id: 'vim-motions',
    type: 'terminal',
    span: 2,
    variant: 'light',
    props: {
      metaTag: 'Tutorial',
      title: 'Vim Motions for Beginners',
      commands: ['vim ~/.vimrc', '" set relative line numbers', 'set relativenumber'],
      link: '#'
    }
  },
  {
    id: 'newsletter-cta',
    type: 'text',
    span: 1,
    variant: 'light',
    props: {
      metaTag: 'Newsletter',
      title: 'Join the 0.1%',
      body: 'Weekly insights on code, aesthetics, and systems.',
      link: '#subscribe',
      showEmailInput: true
    }
  }
];
