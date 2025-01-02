import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const urlParams = new URLSearchParams(location.search);
      const res = await fetch(`/api/post?${urlParams.toString()}`);
      setLoading(false);

      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setSidebarData((prev) => ({
      ...prev,
      [id]: id === "category" && value === "uncategorized" ? "" : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    Object.keys(sidebarData).forEach((key) => {
      if (sidebarData[key]) {
        urlParams.set(key, sidebarData[key]);
      }
    });

    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const res = await fetch(`/api/post?${urlParams.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setShowMore(data.posts.length === 9);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Search Term:</label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              id="category"
              value={sidebarData.category || "uncategorized"}
              onChange={handleChange}
            >
              <option value="uncategorized">All Posts</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
          <Button type="submit">Apply Filters</Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold p-3 mt-5 border-b">
          Posts Results:
        </h1>
        <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && <p>Loading...</p>}
          {!loading && posts.length === 0 && <p>No posts found.</p>}
          {!loading &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 hover:underline w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
