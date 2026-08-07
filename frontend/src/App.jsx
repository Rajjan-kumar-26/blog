import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand">
          MERN Blog
        </Link>
        <Link to="/create" className="btn-link">
          + New Post
        </Link>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>MERN Blog &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
