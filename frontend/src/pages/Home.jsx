import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts, deletePost } from "../api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await getPosts();
      setPosts(res.data);
    } catch (err) {
      setError("Posts load nahi ho paye. Backend chal raha hai check karein.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap is post ko delete karna chahte hain?")) return;
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (posts.length === 0) return <p>Abhi tak koi post nahi hai. Pehla post banayein!</p>;

  return (
    <div className="post-list">
      {posts.map((post) => (
        <article key={post._id} className="post-card">
          <h2>
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
          </h2>
          <p className="meta">
            by {post.author} &middot; {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p className="excerpt">{post.content.slice(0, 150)}...</p>
          <div className="actions">
            <Link to={`/edit/${post._id}`}>Edit</Link>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
