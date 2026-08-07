import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api";

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      setError("Title aur content dono zaroori hain.");
      return;
    }
    try {
      setSaving(true);
      const res = await createPost(form);
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setError("Post save nahi hua. Dobara try karein.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h1>New Post</h1>
      {error && <p className="error">{error}</p>}
      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} />
      </label>
      <label>
        Author
        <input name="author" value={form.author} onChange={handleChange} placeholder="Optional" />
      </label>
      <label>
        Content
        <textarea name="content" rows="10" value={form.content} onChange={handleChange} />
      </label>
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Publish"}
      </button>
    </form>
  );
}
