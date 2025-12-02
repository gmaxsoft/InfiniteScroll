import PostList from "./components/PostList";
import "./App.css";

function App() {

  return (
    <>
      <main className="ListContainer">
        <PostList />
      </main>
      <footer className="footer">&copy; 2025 Infinite List Example</footer>
    </>
  );
}

export default App;
