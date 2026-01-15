import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostList from './PostList';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

// Mock hook
vi.mock('../hooks/useInfiniteScroll');

describe('PostList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('powinien wyświetlić tytuł listy', () => {
    useInfiniteScroll.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      hasMore: false,
      lastElementRef: { current: null },
    });

    render(<PostList />);
    expect(screen.getByText('Lista Postów (Infinite Scroll)')).toBeInTheDocument();
  });

  it('powinien wyświetlić komunikat początkowego ładowania', () => {
    useInfiniteScroll.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      hasMore: true,
      lastElementRef: { current: null },
    });

    render(<PostList />);
    expect(screen.getByText('Początkowe ładowanie...')).toBeInTheDocument();
  });

  it('powinien wyświetlić listę postów', () => {
    const mockPosts = [
      { id: 1, title: 'Test Post 1', body: 'Body of post 1' },
      { id: 2, title: 'Test Post 2', body: 'Body of post 2' },
    ];

    useInfiniteScroll.mockReturnValue({
      data: mockPosts,
      isLoading: false,
      isError: false,
      hasMore: true,
      lastElementRef: { current: null },
    });

    render(<PostList />);
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Body of post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.getByText('Body of post 2')).toBeInTheDocument();
  });

  it('powinien wyświetlić komunikat ładowania kolejnych postów', () => {
    useInfiniteScroll.mockReturnValue({
      data: [{ id: 1, title: 'Test', body: 'Body' }],
      isLoading: true,
      isError: false,
      hasMore: true,
      lastElementRef: { current: null },
    });

    render(<PostList />);
    expect(screen.getByText('Ładowanie kolejnych postów...')).toBeInTheDocument();
  });

  it('powinien wyświetlić komunikat o końcu listy', () => {
    useInfiniteScroll.mockReturnValue({
      data: [{ id: 1, title: 'Test', body: 'Body' }],
      isLoading: false,
      isError: false,
      hasMore: false,
      lastElementRef: { current: null },
    });

    render(<PostList />);
    expect(screen.getByText('Koniec listy postów.')).toBeInTheDocument();
  });

  it('powinien wyświetlić komunikat błędu', () => {
    useInfiniteScroll.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      hasMore: false,
      lastElementRef: { current: null },
    });

    render(<PostList />);
    expect(screen.getByText('Wystąpił błąd podczas ładowania danych.')).toBeInTheDocument();
  });

  it('powinien wyświetlić komunikat zachęcający do przewinięcia', () => {
    useInfiniteScroll.mockReturnValue({
      data: [{ id: 1, title: 'Test', body: 'Body' }],
      isLoading: false,
      isError: false,
      hasMore: true,
      lastElementRef: { current: null },
    });

    render(<PostList />);
    expect(screen.getByText('Przewiń niżej, aby załadować więcej')).toBeInTheDocument();
  });
});
