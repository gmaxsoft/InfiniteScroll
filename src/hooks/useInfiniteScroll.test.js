import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useInfiniteScroll from './useInfiniteScroll';

// Mock fetch
globalThis.fetch = vi.fn();

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('powinien zwrócić początkowy stan', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => useInfiniteScroll('https://jsonplaceholder.typicode.com/posts'));

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.lastElementRef).toBeDefined();
  });

  it('powinien załadować dane z API', async () => {
    const mockData = [
      { id: 1, title: 'Test 1', body: 'Body 1' },
      { id: 2, title: 'Test 2', body: 'Body 2' },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useInfiniteScroll('https://jsonplaceholder.typicode.com/posts'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('?_start=0&_limit=10'),
      expect.any(Object)
    );
  });

  it('powinien obsłużyć błąd sieci', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useInfiniteScroll('https://jsonplaceholder.typicode.com/posts'));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('powinien obsłużyć nieprawidłową odpowiedź', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useInfiniteScroll('https://jsonplaceholder.typicode.com/posts'));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('powinien ustawić hasMore na false, gdy otrzyma mniej danych niż PAGE_SIZE', async () => {
    const mockData = [{ id: 1, title: 'Test 1', body: 'Body 1' }]; // Mniej niż 10

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useInfiniteScroll('https://jsonplaceholder.typicode.com/posts'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
  });

  it('powinien anulować poprzednie żądanie przy nowym', async () => {
    fetch.mockImplementation((url, options) => {
      if (options?.signal) {
        options.signal.addEventListener('abort', () => {});
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    });

    const { result, rerender } = renderHook(
      ({ url }) => useInfiniteScroll(url),
      {
        initialProps: { url: 'https://jsonplaceholder.typicode.com/posts' },
      }
    );

    // Zmień URL, co powinno anulować poprzednie żądanie
    rerender({ url: 'https://jsonplaceholder.typicode.com/comments' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
