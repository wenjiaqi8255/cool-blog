import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import TerminalCard from '../../../components/cards/TerminalCard.astro';

describe('TerminalCard', () => {
  it('renders with commands', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TerminalCard, {
      props: {
        commands: ['npm install', 'npm run dev']
      }
    });

    expect(result).toContain('npm install');
    expect(result).toContain('npm run dev');
  });

  it('renders with title when provided', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TerminalCard, {
      props: {
        title: 'Quick Start',
        commands: ['npm install']
      }
    });

    expect(result).toContain('Quick Start');
  });

  it('has terminal window decorations', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TerminalCard, {
      props: { commands: ['test'] }
    });

    expect(result).toContain('dot red');
    expect(result).toContain('dot yellow');
    expect(result).toContain('dot green');
  });

  it('includes blinking cursor', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TerminalCard, {
      props: { commands: ['echo test'] }
    });

    expect(result).toContain('cursor');
  });

  it('uses monospace font family', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TerminalCard, {
      props: { commands: ['test'] }
    });

    expect(result).toContain('terminal-body');
  });
});
