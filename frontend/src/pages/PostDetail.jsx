import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPost } from "../api";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPost(id)
      .then((res) => setPost(res.data))
      .catch(() => setError("Post nahi mila."));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <article className="post-detail">
      <h1>{post.title}</h1>
      <p className="meta">
        by {post.author} &middot; {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="content">{post.content}</p>
      <Link to="/">&larr; Back to all posts</Link>
    </article>
  );
}
