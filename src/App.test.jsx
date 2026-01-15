import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import PostList from './components/PostList';

// Mock PostList component
vi.mock('./components/PostList', () => ({
  default: () => <div data-testid="post-list">PostList Component</div>,
}));

describe('App', () => {
  it('powinien renderować główny kontener', () => {
    render(<App />);
    const mainContainer = document.querySelector('.ListContainer');
    expect(mainContainer).toBeInTheDocument();
  });

  it('powinien renderować komponent PostList', () => {
    render(<App />);
    expect(screen.getByTestId('post-list')).toBeInTheDocument();
  });

  it('powinien renderować footer z prawami autorskimi', () => {
    render(<App />);
    const footer = screen.getByText(/2025 Infinite List Example/);
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('footer');
  });
});
