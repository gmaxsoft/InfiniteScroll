import { useState, useEffect, useRef, useCallback } from 'react';

// Stała definiująca rozmiar strony dla API
const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE ? parseInt(import.meta.env.VITE_PAGE_SIZE) : 10;

/**
 * Hook do implementacji przewijania w nieskończoność (Infinite Scroll)
 *
 * @param {string} url - Bazowy URL API do pobierania danych
 * @returns {{
 * data: Array<any>,
 * isLoading: boolean,
 * isError: boolean,
 * hasMore: boolean,
 * lastElementRef: React.RefObject<HTMLElement>
 * }}
 */

const useInfiniteScroll = (url) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Ref do elementu, który triggeruje ładowanie (Intersection Observer target)
  const lastElementRef = useRef(null);

  // Ref do obsługi anulowania poprzednich żądań/efektów
  const abortControllerRef = useRef(null);

  /**
   * Funkcja do pobierania danych z API
   * Używa AbortController do zapobiegania race condition.
   */
  const fetchData = useCallback(async (currentPage) => {
    // 1. **Zapobieganie Race Condition (Część 1: Anulowanie poprzedniego żądania)**
    // Jeśli kontroler istnieje, anuluj poprzednie żądanie
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Ustaw nowy AbortController dla bieżącego żądania
    const newController = new AbortController();
    abortControllerRef.current = newController;
    const signal = newController.signal;

    setIsLoading(true);
    setIsError(false);

    try {
      // JSONPlaceholder używa parametrów `_start` i `_limit`
      const start = (currentPage - 1) * PAGE_SIZE;
      const limit = PAGE_SIZE;

      const response = await fetch(`${url}?_start=${start}&_limit=${limit}`, { signal });

      console.log(response);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newData = await response.json();

      // **Sprawdzenie i aktualizacja stanu tylko, jeśli żądanie nie zostało anulowane**
      if (!signal.aborted) {
        setData(prevData => [...prevData, ...newData]);

        // Ustawienie, czy są jeszcze strony do załadowania
        // W JSONPlaceholder sprawdzamy, czy otrzymaliśmy pełną stronę
        setHasMore(newData.length === PAGE_SIZE);

        // Oczyszczenie referencji do kontrolera, gdy żądanie się powiodło
        abortControllerRef.current = null;
      }
    } catch (error) {
      // Obsługa błędu, ignorujemy błąd, jeśli to anulowanie przez AbortController
      if (error.name === 'AbortError') {
        console.log('Fetch aborted:', error.message);
        return;
      }
      if (!signal.aborted) {
        setIsError(true);
      }
    } finally {
      // Ustawienie ładowania na false, tylko jeśli żądanie nie zostało anulowane
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [url]); // `url` jako zależność

  useEffect(() => {
    // Ładuj pierwszą stronę przy montowaniu lub każdą kolejną po zmianie 'page'
    if (page >= 1) {
      fetchData(page);
    }
  }, [page, fetchData]);

  /**
   * Obserwator używający Intersection Observer
   */
  useEffect(() => {
    const currentElement = lastElementRef.current;
    if (!currentElement) return;

    // Nie twórz observera ani nie obserwuj, jeśli już ładujesz LUB nie masz więcej stron
    if (isLoading || !hasMore || !currentElement) {
      // Zawsze odłączamy, jeśli nie powinniśmy obserwować
      return;
    }

    // Konfiguracja Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        // Sprawdzamy, czy element jest widoczny i czy ładowanie jest możliwe
        if (target.isIntersecting && !isLoading && hasMore) {
          // Ładujemy kolejną stronę
          setPage(prevPage => prevPage + 1);
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.1, // Wyzwól, gdy cały element jest widoczny
      }
    );

    // Rozpocznij obserwację elementu
    observer.observe(currentElement);

    // Funkcja czyszcząca
    return () => {
      // Zawsze upewnij się, że observer jest odłączony przy odmontowaniu lub przed zmianą zależności
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };

    // Zależności: Zmiana isLoading lub hasMore powoduje ponowne wykonanie useEffect
    // i ponowne podłączenie observera, jeśli ładowanie się zakończyło
  }, [isLoading, hasMore]);

  // --- Efekt czyszczący dla odmontowania komponentu ---
  useEffect(() => {
    return () => {
      // Anulowanie potencjalnie wciąż trwającego żądania przy odmontowaniu hooka
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Pusta tablica - wykonuje się tylko raz przy odmontowaniu

  return {
    data,
    isLoading,
    isError,
    hasMore,
    lastElementRef,
  };
};

export default useInfiniteScroll;