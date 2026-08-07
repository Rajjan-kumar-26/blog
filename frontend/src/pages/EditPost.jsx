import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../api";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPost(id)
      .then((res) => setForm(res.data))
      .catch(() => setError("Post load nahi hua."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updatePost(id, form);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError("Update fail hua. Dobara try karein.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h1>Edit Post</h1>
      {error && <p className="error">{error}</p>}
      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} />
      </label>
      <label>
        Author
        <input name="author" value={form.author} onChange={handleChange} />
      </label>
      <label>
        Content
        <textarea name="content" rows="10" value={form.content} onChange={handleChange} />
      </label>
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Update"}
      </button>
    </form>
  );
}
