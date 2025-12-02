import React from 'react';
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const API_URL = import.meta.env.VITE_API_URL;

const PostList = () => {
  const { data: posts, isLoading, isError, hasMore, lastElementRef } = useInfiniteScroll(API_URL);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista Postów (Infinite Scroll)</h1>
      
      {/* Kontener listy z przewijaniem */}
      <div className="infinite-scroll-container">
        
        {/* Początkowe ładowanie, gdy lista jest pusta */}
        {isLoading && posts.length === 0 && <p className="loading-trigger">Początkowe ładowanie...</p>}

        {/* Renderowanie postów */}
        {posts.map((post) => (
          <div
            key={post.id} // Upewnij się, że używasz unikalnego klucza (jak już omówiliśmy!)
            className="post-item"
          >
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <small>ID: {post.id}</small>
          </div>
        ))}

        {/* Element triggerujący i status ładowania/braku danych */}
        {/* Element lastElementRef musi być widoczny, aby IO go złapał, nawet jeśli się ładuje/nie ma więcej */}
        <div 
          ref={lastElementRef} 
          className="loading-trigger"
        >
          {hasMore ? (
            isLoading ? 
                <p>Ładowanie kolejnych postów...</p> 
                : 
                <p>Przewiń niżej, aby załadować więcej</p>
          ) : (
            <p style={{ color: '#6c757d' }}>Koniec listy postów.</p>
          )}
        </div>
        
        {/* Komunikat o błędzie (poza elementem triggera, aby był wyraźny) */}
        {isError && <p className="error-message">Wystąpił błąd podczas ładowania danych.</p>}
      </div>
    </div>
  );
};

export default PostList;