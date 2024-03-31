import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import CommentSection from "../components/CommentSection";

const Post = () => {
  const { slugId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setError(false);
        setLoading(true);
        const res = await fetch(`/api/post?slug=${slugId}`);
        const data = await res.json();

        if (res.ok) {
          setLoading(false);
          setPost(data.posts[0]);
        } else {
          setLoading(false);
          setError(data.message);
        }
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };
    fetchPost();
  }, [slugId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post?.title}
      </h1>
      <Link
        to={`/search?category=${post?.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post?.category}
        </Button>
      </Link>
      <img
        src={post?.image}
        alt={post?.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <CommentSection postId={post?._id} />
    </main>
  );
};

export default Post;
