import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Spinner,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    const fetchUserPost = async () => {
      setError(null);
      try {
        const res = await fetch(`/api/post?postId=${postId}`);
        const data = await res.json();
        if (res.ok) {
          setFormData(data.posts[0]);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUserPost();
  }, [postId]);

  const handleImageUpload = (e) => {
    if (formData.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      if (formData.image) {
        reader.readAsDataURL(formData.image);
      } else {
        setImagePreview(null);
      }
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      return setError("All fields are required");
    }
    const form = new FormData();

    if (formData.title) form.append("title", formData.title);
    if (formData.content) form.append("content", formData.content);
    if (formData.category) form.append("category", formData.category);
    if (formData.image) form.append("image", formData.image);

    try {
      setError(false);
      setLoading(true);
      const res = await fetch(`/api/post/${postId}`, {
        method: "PATCH",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={
              imagePreview ? () => setImagePreview(null) : handleImageUpload
            }
          >
            {imagePreview ? "Remove image" : "Upload image"}
          </Button>
        </div>
        {imagePreview && (
          <div className="max-w-80 mx-auto">
            <img src={imagePreview} className="w-full" />
          </div>
        )}
        {formData.image && typeof formData.image === "string" && (
          <div className="max-w-80 mx-auto">
            <img src={formData.image} className="w-full" />
          </div>
        )}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Update Post"
          )}
        </Button>
        {error && <Alert color="failure">{error}</Alert>}
      </form>
    </div>
  );
};

export default UpdatePost;
